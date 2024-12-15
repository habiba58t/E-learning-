import { Injectable, NotFoundException, UseGuards ,forwardRef,Inject} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Quiz, QuizzesDocument } from './quizzes.schema';  // Assuming your Quiz schema is defined
import { QuestionsService } from '../questions/questions.service'; // Service to fetch questions
import { ModulesService } from '../modules/modules.service'; // Service to interact with the module
import { Question, QuestionsDocument } from '../questions/questions.schema'; // Assuming Question schema
import { Responses, ResponsesDocument } from '../responses/responses.schema'; // Assuming Question schema
import {StudentService} from '../users/student/student.service'
import { Users, userDocument } from '../users/users.schema'; // Assuming Student schema
import { CreateQuizDto } from './dto/create-quiz.dto';  // DTO for quiz creation
import { ResponsesService } from '../responses/responses.service';
import { Courses, courseDocument } from '../courses/courses.schema';
import {Module, moduleDocument} from '../modules/modules.schema';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import { ProgressService } from 'src/progress/progress.service';
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


@UseGuards(AuthGuard) // Apply AuthGuard globally to all methods
@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizzesDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionsDocument>,
    @InjectModel(Users.name) private studentModel: Model<userDocument>, // Inject Student model
    @InjectModel(Responses.name) private responseModel: Model<ResponsesDocument>, // Inject Student model
    @InjectModel(Courses.name) private courseModel: Model<courseDocument>, // Inject Student model
    @InjectModel(Module.name) private moduleModel: Model<moduleDocument>, // Inject Student model
     // Inject Student model
    @Inject(forwardRef(() => ModulesService)) private readonly moduleService: ModulesService,
    @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService,
    @Inject(forwardRef(() => StudentService)) private readonly studentService: StudentService,
    @Inject(forwardRef(() => ResponsesService)) private readonly responseService: ResponsesService,
    @Inject(forwardRef(() => CoursesService)) private readonly courseService: CoursesService,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: CoursesService,
    @Inject(forwardRef(() => QuestionsService)) private readonly questionService: QuestionsService,

    
    
      // Injecting the user service
    
    
    

    ) { }

// Instructor generates the "imaginary" quiz
//the quiz should be added to the module arrya of quizzes
// @UseGuards(AuthorizationGuard) // Additional guard for authorization
// @Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
// async generateQuiz(
//   no_of_questions: number,
//   types_of_questions: 'mcq' | 't/f' | 'both',
//   moduleId: mongoose.Types.ObjectId,
// ) {
//  // let questions: []; //no need to specify type, will be inferred from getQuestionsByModuleId 
//   //as it returns an array of Object Id references to Question
//   //also only declare as Question if it's fully populated with whole question
//   //details but here its ObjectIds only
//   //note .populate('questions'), is used to populate field called questions
//   //can also add 2nd parameter t specify projectioin field names like ..,type created_by

//   // Fetch all questions object ids related to the module
//   const moduleQuestions = await this.moduleService.getQuestionsForModule(moduleId)

//   // //populate q,since get method of questions returns object ids 
//   //of all questions in the module, can just call populate questions
//   // let questions = await this.questionModel
//   //   .find({ _id: { $in: moduleQuestions } }) // Fetch all questions by their ObjectIds
//   //   .exec();
// // Fetch all questions based on the module's questions ObjectIds
// const popQuestions: QuestionsDocument[] = await this.questionModel
// .find({ _id: { $in: moduleQuestions } })
// .exec();

// // Ensure we have questions
// if (!popQuestions.length) {
//   throw new Error('No questions found for the module');
// }

// let questions: QuestionsDocument[]; //array of populated questions

//   // Filter questions based on types, now questions has the fully populated quesitons document
//   if (types_of_questions! === 'both') {
//     questions = popQuestions; // Use all questions if both types are selected
//   } else {
//     questions = popQuestions.filter(q=> q.type === types_of_questions); // Filter by type
//   }

//   // Check if there are enough questions for the quiz
//   if (questions.length < no_of_questions) {
//     throw new Error('Not enough questions for the quiz');
//   }

//   // "Imaginary" quiz: Store questions but do not randomize or select a subset here
//   const quiz = new this.quizModel({
//     no_of_questions,
//     types_of_questions,
//     questions: questions.map(q => q._id), // Store only the question IDs
//     created_by: popQuestions[0].created_by, // Assuming the instructor is the same for the questions
//     isOutdated: false, // Default value for outdated flag
//   });

//   // Add the quiz to the module (linking it to the module)
//   await this.moduleService.addQuizToModule(moduleId, quiz._id);

//   // Save and return the "imaginary" quiz
//   return await quiz.save();
// }

 // Student prepares to take the quiz: Select questions randomly based on their score
  // IN FRONT END WHEN STUDENT CLICKS ON TAKE QUIZ: render selectedQuestions
  // and calc score using length of answers array as it changes dynamically if length of this < no of questions
  // specified by the instructor*
// Updated `prepareQuizForStudent` method
async prepareQuizForStudent(
  qId: string,
  username: string,
): Promise<QuestionsDocument[]> {
  const quizId = new mongoose.Types.ObjectId(qId);

  // Fetch the student and validate
  const student = await this.studentModel.findOne({ username }).exec();
  if (!student) {
    throw new Error('Student not found');
  }

  // Fetch the quiz
  const quiz = await this.quizModel.findById(quizId).exec();
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // Fetch course details for determining student level
  const module = await this.moduleService.findModuleByQuizId(qId);
  const course = module ? await this.courseService.findCourseByModuleId(module._id) : null;

  if (!course) {
    throw new Error('Course not found');
  }

  const studentLevel = await this.studentService.getStudentLevel(username, course._id);
  if (!studentLevel) {
    throw new Error('Student level not found for this course');
  }

  // Filter questions and ensure sufficient quantity
  const filteredQuestions = await this.filterQuestionsByDifficulty(quiz.questions, studentLevel);
  const selectedQuestions = this.randomizeAndSelectQuestions(
    filteredQuestions,
    quiz.no_of_questions,
  );

  return selectedQuestions;
}

// Improved filterQuestionsByDifficulty
private async filterQuestionsByDifficulty(
  questionIds: mongoose.Types.ObjectId[],
  studentLevel: string,
): Promise<QuestionsDocument[]> {
  const allQuestions = await this.questionModel.find({ _id: { $in: questionIds } });

  // Classify questions into difficulty buckets
  const questionBuckets = {
    easy: allQuestions.filter(q => q.difficulty_level === 'easy'),
    medium: allQuestions.filter(q => q.difficulty_level === 'medium'),
    hard: allQuestions.filter(q => q.difficulty_level === 'hard'),
  };

  // Define difficulty ratios based on student level
  const difficultyDistribution = {
    easy: 0.7,
    medium: 0.25,
    hard: 0.05,
  };

  if (studentLevel === 'medium') {
    difficultyDistribution.easy = 0.2;
    difficultyDistribution.medium = 0.6;
    difficultyDistribution.hard = 0.2;
  } else if (studentLevel === 'hard') {
    difficultyDistribution.easy = 0.1;
    difficultyDistribution.medium = 0.45;
    difficultyDistribution.hard = 0.45;
  }

  // Calculate required question counts for each difficulty
  const requiredCounts = {
    easy: Math.round(difficultyDistribution.easy * questionIds.length),
    medium: Math.round(difficultyDistribution.medium * questionIds.length),
    hard: Math.round(difficultyDistribution.hard * questionIds.length),
  };

  // Adjust counts dynamically if insufficient questions in any category
  return [
    ...questionBuckets.easy.slice(0, requiredCounts.easy),
    ...questionBuckets.medium.slice(0, requiredCounts.medium),
    ...questionBuckets.hard.slice(0, requiredCounts.hard),
  ];
}

// Improved randomizeAndSelectQuestions with Fisher-Yates Shuffle
private randomizeAndSelectQuestions(
  questions: QuestionsDocument[], //ex 2
  numberOfQuestions: number, //ex 4
): QuestionsDocument[] {
  if (numberOfQuestions > questions.length) {
    numberOfQuestions = questions.length //ex instructor wants 4 questions but only 2 are found
   }

  const shuffled = [...questions]; // Clone the array to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }

  return shuffled.slice(0, numberOfQuestions); // Select the first 'numberOfQuestions' after shuffle
}



//not useful..
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
 @UseGuards(AuthorizationGuard) // Additional guard for authorization
  @Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
 async getQuizzesByInstructorId(instructorId: mongoose.Types.ObjectId): Promise<QuizzesDocument[]> {
  return await this.quizModel.find({ created_by: instructorId }).populate('questions');
}//this returns for frontend side bar part where instructor can see a list of quizzes
//i want to add an option where instructor can know this quiz belongs to which module in which course so
//i can take each quiz then in module implement findModuleByQuizId and call it for each quiz
//then findCourseByModuleId

//button see reponses 
 //get the quiz by id
  // Get all responses for the instructor from that quiz

    // Get quizzes available for students (non-outdated quizzes) according to the modules of the course
    //they take that do have active quizzes

async getQuizzesForStudents(username: string): Promise<QuizzesDocument[]> {
      // Step 1: Get all courses the student is enrolled in
      const student: userDocument = await this.studentModel
  .findOne({ username })
  .populate({
    path: 'courses', // Populate courses
    model: 'Courses',
    populate: {
      path: 'modules', // Populate modules inside each course
      populate: {
        path: 'quizzes', // Populate quizzes inside each module
      },
    },
  }); 
          //get student will all attributes and array of fully populated courses not just _ids
      if (!student) throw new Error('Student not found');


      const courses = student.courses; //then find course by courseid


      if (!courses || courses.length === 0) return []; // No courses, no quizzes
    
      // Step 2: Initialize an array to hold quizzes
      let quizzes: QuizzesDocument[] = [];

      // Step 3: For each course, find all modules with quizzes
      for (const course of courses) {
        const c = await this.courseService.getcoursebyid(course)
        const modules = c.modules; //return module ids
        if (!modules || modules.length === 0) continue;
    
        for (const module of modules) {
          let quizzes = await this.moduleService.getQuizzesForModule(module)

          // Step 4: Filter quizzes that are not outdated
          const validQuizzes = quizzes.filter((quiz: QuizzesDocument) => !quiz.isOutdated);
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
@UseGuards(AuthorizationGuard) // Additional guard for authorization
  @Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor, student can't see
  //other students' scores/responses
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

//for a specific student
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
//creates response and adds it to the array of responses in the quiz
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
  const penalty = scorePercentage < 0.5 ? -(1-scorePercentage) : 0; // Penalty if score is less than 50%

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
// Check if the response ID already exists in the quiz's responses array to avoid duplicates
if (!quiz.responses.includes(response._id)) {
  quiz.responses.push(response._id);
  await quiz.save();
}

  // Step 4: Update the student's score for the course
  const student = await this.studentModel.findOne({ username: studentUsername });
  if (student) {
    // Find the course by populating the modules to access quizzes
    const course = await this.courseModel.findOne({ 'modules.quizzes._id': quizId }).populate('modules.quizzes');

    if (course) {
      // Find the existing course score entry for the student
      //const courseStudentScore = student.studentScores.find(score => score.course_id.equals(course._id));
      let courseStudentScore = await this.studentService.getStudentScore(studentUsername, course._id)


      // If the course exists in the student's scores array, update the score directly
      //it should exist since we are adding it on enroll, but just in case
      if (courseStudentScore) {
        // Apply penalty for failing (score < 0.5) or add the score for passing
        courseStudentScore += (penalty ? penalty : scorePercentage);
      } else {
        // If the course doesn't exist in the student's scores, create a new entry
        // enroll already adds an entry so this is probably not useful, but i added it to avoid errors
        student.studentScore.set( course._id, courseStudentScore );
      }

      await student.save();
      await this.studentService.setStudentScore(studentUsername, course._id, courseStudentScore); //this calls
      //setStudentLevel
    }
    
  }

  // Prepare message for frontend
  const message = scorePercentage < 0.5 
    ? 'Advice student to revise this module' 
    : 'You passed the quiz';

  // Return the result message
  return { message };
}




// Delete quiz by ID
//when quiz is deleted, it should be deleted from the module
//it's correspoding responses should also be deleted so loop on reponses array
//and delete reponses before quiz is deleted
@UseGuards(AuthorizationGuard) // Additional guard for authorization
@Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
async deleteQuiz(quizId: mongoose.Types.ObjectId): Promise<{ message: string }> {
  // Step 1: Find the quiz to delete
  const quiz = await this.quizModel.findById(quizId).exec();
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // Step 2: Delete all responses associated with the quiz
  // Loop through the quiz's responses array and delete each response
  for (const responseId of quiz.responses) {
    await this.responseModel.findByIdAndDelete(responseId).exec();
  }

  // Step 3: Remove the quiz reference from the module
  // Assuming the module has a 'quizzes' array that contains this quizId
  const module = await this.moduleModel.findOneAndUpdate(
    { quizzes: quizId },  // Find the module that contains this quizId
    { $pull: { quizzes: quizId } }  // Remove the quizId from the quizzes array
  ).exec();
  
  if (!module) {
    throw new Error('Module not found or quiz reference not found in the module');
  }

  // Step 4: Delete the quiz itself
  await this.quizModel.findByIdAndDelete(quizId).exec();

  return { message: 'Quiz and associated responses deleted successfully' };
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