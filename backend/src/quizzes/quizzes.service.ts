import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Quiz, QuizzesDocument } from './quizzes.schema';  // Assuming your Quiz schema is defined
import { QuestionsService } from '../questions/questions.service'; // Service to fetch questions
import { ModulesService } from '../modules/modules.service'; // Service to interact with the module
import { StudentsService } from '../users/students/students.service'; // Service to get the student
import { Question, QuestionsDocument } from '../questions/questions.schema'; // Assuming Question schema
import { Responses, ResponsesDocument } from '../responses/responses.schema'; // Assuming Question schema

import { Student, StudentsDocument } from '../users/students/students.schema'; // Assuming Student schema
import { CreateQuizDto } from './dto/create-quiz.dto';  // DTO for quiz creation
import { Module } from '../modules/modules.schema'; // Assuming Module schema exists
import { ResponsesService } from '../responses/responses.service';

//findQuestionsByModuleId(moduleId) in modules?*
//addQuestionToModule(moduleId, newQuestion._id) in modules?*
//addQuizToModule(moduleId, quiz._id) in modules?*
//setStudentLevel in student?*

//for instructor: goes to courses -> modules -> generate quiz -> filter quizzes according to module id, getQuestionsByModuleId
// form to input question inclusion type and no of questions
//click on create quiz which create a quiz with array of questions satisying these criteria (done in quizzes)

//for instructor: goes to courses -> modules -> questions bank -> gets all questions by module id (GetQuestionsByModuleId)
//and option to create question beside each module in the page -> form to input queston text, level, etc..
//click on create questions which create a question and adds it to module array of this questions (done in questions)


//for instructor: go to quizzes -> sees a list of all quizzes, calls GetQuizzesByInstructorId (gets all quizzes created by this instructor)->done
//each quiz has 'see responses' which calls GetResponsesByQuizId in reponses component -> implemented in quizzes -> done
//it goes to a page that shows usernames and scores of students who took this quiz -> done 
//it can also show visualization charts for this quiz like avg score, all visualizations will be decided
//later once front end is done and main components are built 

//for instructor: go to quizzes -> sees a list of all quizzes by calling GeQuizzesByInstructorId -> each quiz also has flag ,done
// beside see reponses -> makes quiz hidden from students only not instructors, done
//so when we call this for instructor, they should see list of all quizzes as well as red for the flag if outdates, or green if
//not outdated, this is done after calling to see list of all quizzes, it will call getIsOutdated which returns boolean
//true or false and then check to decide UI color
//quizzes will have an attribute isOutdated, clicking sets it to true, done
//for student calling getQuizzesByStudentId -> selects isOutdated==false only

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizzesDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionsDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentsDocument>, // Inject Student model
    @InjectModel(Responses.name) private responseModel: Model<ResponsesDocument>, // Inject Student model

    private readonly moduleService: ModulesService,
    private readonly questionService: QuestionsService,
    private readonly studentService: StudentsService,  // Injecting the user service
    private readonly responseService: ResponsesService
    ) { }

// Instructor generates the "imaginary" quiz
async generateQuiz(
  no_of_questions: number,
  types_of_questions: 'mcq' | 't/f' | 'both',
  moduleId: mongoose.Types.ObjectId,
) {
 // let questions: []; //no need to specify type, will be inferred from getQuestionsByModuleId 
  //as it returns an array of Object Id references to Question
  //also only declare as Question if it's fully populated with whole question
  //details but here its ObjectIds only
  //note .populate('questions'), is used to populate field called questions
  //can also add 2nd parameter t specify projectioin field names like ..,type created_by

  // Fetch all questions object ids related to the module
  const moduleQuestions = await this.moduleService.findQuestionsByModuleId(moduleId).populate('questions');

  // //populate q,since get method of questions returns object ids 
  //of all questions in the module, can just call populate questions
  // let questions = await this.questionModel
  //   .find({ _id: { $in: moduleQuestions } }) // Fetch all questions by their ObjectIds
  //   .exec();

  let questions: QuestionsDocument[]; //array of populated questions

  // Filter questions based on types, now questions has the fully populated quesitons document
  if (types_of_questions! === 'both') {
    questions = moduleQuestions; // Use all questions if both types are selected
  } else {
    questions = moduleQuestions.filter(q => q.types_of_questions === types_of_questions); // Filter by type
  }

  // Check if there are enough questions for the quiz
  if (questions.length < no_of_questions) {
    throw new Error('Not enough questions for the quiz');
  }

  // "Imaginary" quiz: Store questions but do not randomize or select a subset here
  const quiz = new this.quizModel({
    no_of_questions,
    types_of_questions,
    questions: questions.map(q => q._id), // Store only the question IDs
    created_by: moduleQuestions[0].created_by, // Assuming the instructor is the same for the questions
    isOutdated: false, // Default value for outdated flag
  });

  // Add the quiz to the module (linking it to the module)
  await this.moduleService.addQuizToModule(moduleId, quiz._id);

  // Save and return the "imaginary" quiz
  return await quiz.save();
}

 // Student prepares to take the quiz: Select questions randomly based on their score
async prepareQuizForStudent(quizId: mongoose.Types.ObjectId, username: string): Promise<QuestionsDocument[]> {
  // Fetch the quiz by ID, populated
  const quiz = await this.getQuizByQuizId(quizId);
  if (!quiz) {
    throw new Error('Quiz not found'); // Error if quiz doesn't exist
  }

  // Get the student record using their username
  const student = await this.studentModel.findOne({ username: username }).exec(); // Fetch the student record
  if (!student) {
    throw new Error('Student not found'); // Error if student doesn't exist
  }

  const studentLevel = student.studentLevel; // Extract the student's level

  
  // Filter questions based on student's score (difficulty)
  const filteredQuestions = await this.filterQuestionsByDifficulty(quiz.questions, studentLevel);

  // Randomly select questions based on the required number specified in the quiz
  // If the number of available questions is less than quiz.no_of_questions, return all available questions
  const selectedQuestions = this.randomizeQuestions(filteredQuestions, quiz.no_of_questions);

  // Return the selected questions for the student to take
  return selectedQuestions; 
  // IN FRONT END WHEN STUDENT CLICKS ON TAKE QUIZ: render selectedQuestions
  // and calc score using length of answers array as it changes dynamically if length of this < no of questions
  // specified by the instructor*
}



 // Helper to filter questions based on student's score (difficulty level)
 //still didn't consider no of questions instructor wants
 private async filterQuestionsByDifficulty(questions: mongoose.Types.ObjectId[], studentLevel: string): Promise<QuestionsDocument[]> {
  let easyQuestions: QuestionsDocument[] = [];
  let mediumQuestions: QuestionsDocument[] = [];
  let hardQuestions: QuestionsDocument[] = [];

  // Fetch all questions for the quiz, populated 
  const allQuestions = await this.questionModel.find({ _id: { $in: questions } });

  // Classify questions based on difficulty
  allQuestions.forEach(q => {
    if (q.difficulty_level === 'easy') {
      easyQuestions.push(q);
    } else if (q.difficulty_level === 'medium') {
      mediumQuestions.push(q);
    } else if (q.difficulty_level === 'hard') {
      hardQuestions.push(q);
    }
  });

  // Distribute questions based on student score
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;

 // Logic to distribute questions based on the student's score (you can adjust this)
 if (studentLevel === 'below average') {
  easyCount = Math.floor(0.7 * questions.length);  // 70% easy
  mediumCount = Math.floor(0.25 * questions.length);  // 25% medium
  hardCount = Math.floor(0.05 * questions.length);  // 5% hard
} else if (studentLevel === 'above average') {
  easyCount = Math.floor(0.20 * questions.length);  // 50% easy
  mediumCount = Math.floor(0.60 * questions.length);  // 40% medium
  hardCount = Math.floor(0.20 * questions.length);  // 10% hard
} else if (studentLevel === 'excellent') {
  easyCount = Math.floor(0.1 * questions.length);  // 30% easy
  mediumCount = Math.floor(0.45 * questions.length);  // 40% medium
  hardCount = Math.floor(0.45 * questions.length);  // 30% hard
}

  // Return filtered questions based on score 
  return [
    ...easyQuestions.slice(0, easyCount),
    ...mediumQuestions.slice(0, mediumCount),
    ...hardQuestions.slice(0, hardCount),
  ];
}

// Helper to randomly select questions
private randomizeQuestions(questions: QuestionsDocument[], numberOfQuestions: number): QuestionsDocument[] {
  // If the available questions are less than the desired number, return the entire array
  if (questions.length <= numberOfQuestions) {
    return questions; //now problem is quiz score calculation becomes more complex
  }
  // Otherwise, shuffle and return the required number of questions
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
  }
  return shuffled.slice(0, numberOfQuestions);
}



  async getQuizByQuizId(quizId: mongoose.Types.ObjectId): Promise<QuizzesDocument> {
    const quiz = await this.quizModel.findById(quizId).populate('questions');
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  }

//done with create and take quiz

//now when instructor goes to quizzes it shows a list of all quizzes created by this instructor 
//and for each a button see reponses
//in front end u will get all the quizzes and see if isOutdated is true to set UI
 // Get all quizzes created by an instructor fully populated
 async getQuizzesByInstructorId(instructorId: mongoose.Types.ObjectId): Promise<QuizzesDocument[]> {
  return await this.quizModel.find({ created_by: instructorId }).populate('questions');
}

//button see reponses 
 //get the quiz by id
  // Get all responses for the instructor from that quiz

    // Get quizzes available for students (non-outdated quizzes) according to the modules of the course
    //they take that do have active quizzes
    async getQuizzesForStudents(username: string): Promise<QuizzesDocument[]> {
      // Step 1: Get all courses the student is enrolled in
      const student = await this.studentModel.findOne({ username }).populate('courses.module.quizzes'); // courses will be populated
      //get student will all attributes and array of fully populated courses not just _ids
      if (!student) throw new Error('Student not found');
    
      const courses = student.courses;
      if (!courses || courses.length === 0) return []; // No courses, no quizzes
    
      // Step 2: Initialize an array to hold quizzes
      let quizzes: QuizzesDocument[] = [];
    
      // Step 3: For each course, find all modules with quizzes
      for (const course of courses) {
        const modules = course.modules; //return module ids
        if (!modules || modules.length === 0) continue;
    
        for (const module of modules) {
          if (!module.quizzes || module.quizzes.length === 0) continue;
    
          // Step 4: Filter quizzes that are not outdated
          const validQuizzes = module.quizzes.filter((quiz: QuizzesDocument) => !quiz.isOutdated);
          quizzes = [...quizzes, ...validQuizzes]; //if validQuizzes are found, append
          //it to quizzes array
          //since modules have 1 quiz, validQuizzes won't return an array
          //quizzes.push(validQuizzes), hwever still not correct sinze in modules
          //we kept it as an array of quiz in case future enhancements are needed
        }
      }
    
      return quizzes;
    }
    // ... ->spread operator to unpack arrayobject elements and insert to another
    //array/object 
    //unpack quizzes and valid quizzes into separate array elements
    //concatenate into new array to have quizzes and valid quizzes
    //ex: validQuizzes=quiz1, quizzes=-,quiz1 ->quiz1



  //instructor only
  //click on flag to make quiz outdated, and click again to make it not outdated
  // Toggle the "isOutdated" flag for a quiz
  async isOutdatedFlagClick(quizId: mongoose.Types.ObjectId): Promise<void> {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    quiz.isOutdated = !quiz.isOutdated;  // Toggle the outdated flag
    await quiz.save();
  }

  

  //so far instructor can create question which adds it to module array
  //instructor can delete or update a question 
  //instructor can generate quiz which adds it to module array
  //instructor can view all their quizzes (get by instructor id) and its responses (get reponses by quiz id)
  //instructor can make a quiz outdated
  
// Get responses by quiz ID (student answers and scores) -> instructor sees report for a certain quiz
async getResponsesByQuizId(quizId: mongoose.Types.ObjectId): Promise<any[]> {
  const quiz = await this.quizModel.findById(quizId).populate('responses');
  if (!quiz) {
    throw new Error('Quiz not found');
  }
  return quiz.responses;  // Returns the responses array associated with the quiz
  //in front end organize single quiz responses into username, score and then take scores from all
  //quiz resoponses and calculate average and visualization for max, min, and so on
  //in front end make it downloadable
}


async getResponsesByQuizIdAndUsername(quizId: mongoose.Types.ObjectId, username: string): Promise<ResponsesDocument | null> {
  // Step 1: Find the quiz by its ID
  const quiz = await this.quizModel.findOne({ _id: quizId });
  if (!quiz) {
    throw new Error('Quiz not found'); // Error handling if quiz does not exist
  }

  // Step 2: Fetch all responses associated with the quiz (no need to use populate unless necessary)
  const responses = await this.responseModel.find({ _id: { $in: quiz.responses } });
  
  // Step 3: Find the response for the given username
  const response = responses.find(r => r.username === username); // Find the specific response based on the username
  
  if (!response) {
    throw new Error('No response found for the student'); // Error if student has no response for this quiz
  }

  // Step 4: Return the response associated with the student for this quiz
  return response; // Return the student response
}

  // Returns the response associated with the quiz of a certain student
  //in front end organize student quiz response by extracting score, then going to array of answers in 
  //the reponse and getting each quesion id in answers array, then for each question, get correct answer
  //display all student answers enumerated in order like a list, and beside it
  //if it matches correct answer make it green, other wise make it red and add correct answer beside it
  //in front end make it downloadable


// Method to check if a student has already taken a quiz (i.e., has a response)
async checkStudentQuizStatus(
  quizId: mongoose.Types.ObjectId,
  studentUsername: string,
): Promise<boolean> {
  // Step 1: Retrieve the quiz by its ID and populate responses
  const quiz = await this.quizModel
    .findById(quizId)
    .populate<{ responses: ResponsesDocument[] }>('responses')
    .exec();

  if (!quiz) {
    throw new NotFoundException('Quiz not found');
  }

  // Step 2: Check if any response in the quiz matches the student's username
  const hasResponded = quiz.responses.some(
    (response) => response.username === studentUsername,
  );

  // Step 3: Return true if a matching response is found, otherwise false
  return hasResponded;
}





 // Method for students to submit their answers and create a response
//have the answers and corresponding question IDs sent from the FRONTEND
async submitQuiz(
  quizId: mongoose.Types.ObjectId,
  studentUsername: string,
  studentAnswersObject: Record<string, string>
): Promise<any> {
  // Step 1: Retrieve the quiz by its ID
  const quiz = await this.quizModel.findById(quizId);
  if (!quiz) throw new Error('Quiz not found');

  // Fetch all questions that are part of the quiz
  const allQuestions = await this.questionModel.find({ '_id': { $in: quiz.questions } });

  // Check for empty quiz
  if (allQuestions.length === 0) {
    throw new Error('No questions found for the quiz');
  }

  // Convert studentAnswersObject to an array of { questionId, answer }
  const studentAnswers: { questionId: mongoose.Types.ObjectId, answer: string }[] = Object.keys(studentAnswersObject).map(key => ({
    questionId: new mongoose.Types.ObjectId(key), // Convert the key to ObjectId
    answer: studentAnswersObject[key], // Answer is a string
  }));

  let score = 0;

  // Compare student's answers with correct answers and calculate score
  allQuestions.forEach((question) => {
    const studentAnswer = studentAnswers.find(answer => answer.questionId.equals(question._id));
    if (studentAnswer && question.correct_answer === studentAnswer.answer) {
      score += 1; // Increase score for correct answers
    }
  });

  // Calculate score as a percentage
  const scorePercentage = score / allQuestions.length;

  // Apply penalty for failing (score < 0.5)
  const penalty = scorePercentage < 0.5 ? 1 - scorePercentage : 0;

  // Prepare response data
  const responseData = {
    username: studentUsername,
    quiz_id: quizId,
    score: scorePercentage,
    answers: studentAnswers,
  };

  // Step 2: Check if the student has already submitted a response
  const existingResponse = await this.responseModel.findOne({ username: studentUsername, quiz_id: quizId });

  let response;
  if (existingResponse) {
    // Update existing response if already taken
    response = existingResponse;
    response.score = scorePercentage;
    response.answers = studentAnswers;
    await response.save();
  } else {
    // Create a new response if not already taken
    response = new this.responseModel(responseData);
    await response.save();
  }

  // Step 3: Update the quiz with the new or updated response
  quiz.responses.push(response._id);
  await quiz.save();

  // Step 4: Update student's score
  const student = await this.studentModel.findOne({ username: studentUsername });
  if (student) {
    student.studentScore += (scorePercentage < 0.5 ? -penalty : scorePercentage);
    await student.save();
  }

  // Step 5: Update the student's level based on the new score
  await student.setStudentLevel(studentUsername, student.studentScore);

  // Prepare message for frontend
  const message = scorePercentage < 0.5 
    ? 'Advice student to revise this module' 
    : 'You passed the quiz';

  // Return the result message
  return { message };
}

// Delete quiz by ID
async deleteQuiz(quizId: mongoose.Types.ObjectId): Promise<{ message: string }> {
  const deletedQuiz = await this.quizModel.findByIdAndDelete(quizId);
  if (!deletedQuiz) {
    throw new Error('Quiz not found');
  }
  return { message: 'Quiz deleted successfully' };
}



 }


 //student can take/RETAKE quiz
 //student can submit quiz , on submitQuiz:
//student received immediate score using correctQuiz method of this quiz which takes answers[] from front end
//and compares each quesions correct answer with this answer
//correct calculates score and returns it along with answers vs correct answer
//and submitQuiz continues to create a reponse and adds it to array of quiz

//student has quizzes page where they can see a list of all unoutdated quizzes
//if this quiz id exists in responses array of the quiz along with username=username then 
//quiz should have button see details which calls correctQuiz method
//if not it should call take quiz which shows him the quiz and was already implemented 
//












