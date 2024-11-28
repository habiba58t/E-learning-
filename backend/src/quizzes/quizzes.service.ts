import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import mongoose from 'mongoose';
import { Quiz } from './quizzes.schema';
import { Question } from '../questions/questions.schema';
import { InjectModel } from '@nestjs/mongoose';
import {Module} from '../modules/modules.schema';
//for instructor: goes to courses -> modules -> generate quiz -> filter quizzes according to module id, getQuestionsByModuleId
// form to input question inclusion type and no of questions
//click on create quiz which create a quiz with array of questions satisying these criteria (done)

//for instructor: goes to courses -> modules -> questions bank -> gets all questions by module id (GetQuestionsByModuleId)
//and option to create question at the bottom of the page -> form to input queston text, level, etc..
//click on create questions which create a question and adds it to question array of this quiz


//for instructor: go to quizzes -> sees a list of all quizzes, it calls GetQuizzesByInstructorId (gets all quizzes created by this instructor)
//each quiz has 'see responses' which calls GetResponsesByQuizId in reponses component
//it goes to a page that shows usernames and scores of students who took this quiz
//it can also show visualization charts for this quiz like avg score, all visualizations will be decided
//later once front end is done and main components are built

//for instructor: go to quizzes -> sees a list of all quizzes by calling GeQuizzesByInstructorId -> each quiz also has flag
// beside see reponses -> makes quiz hidden from students only not instructors
//so when we call this for instructor, they should see list of all quizzes as well as red for the flag if outdates, or green if
//not outdated, this is done after calling to see list of all quizzes, it will call getIsOutdated which returns boolean
//true or false and then check to decide UI color
//quizzes will have an attribute isOutdated, clicking sets it to true
//for student calling getQuizzesByStudentId -> selects isOutdated==false only

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: mongoose.Model<Question>,
    @InjectModel(Quiz.name) private quizModel: mongoose.Model<Quiz>,
    @InjectModel(Module.name) private moduleModel: mongoose.Model<Module>
) { }

async generateQuiz(no_of_questions: number, types_of_questions: 'mcq' | 't/f' | 'both', moduleId: mongoose.Types.ObjectId) {
  let questions: Question[];
  questions = await this.moduleService.getQuestionsByModuleId(moduleId); //filter questons so they are related to a certain module
  if (types_of_questions === 'both') {
    questions = await this.questionModel.find(); // Fetch all questions
  } else {
    questions = await this.questionModel.find({ type: types_of_questions }); // Fetch questions by type
  } //now questions has questions with specified type and relavant to module
 
  // Create a quiz document to 'create' quiz as a concept of questions filtered according to requirements
  //but technically not a quiz yet
  const quiz = new this.quizModel({
    no_of_questions,
    types_of_questions,
    questions: questions.map(q => q._id), // Store only question IDs
    responses: [], // Empty responses array
  });



  // Save and return the quiz
  return quiz.save();
}
 

 
//whenever studet clicks to take a certain quiz, it will pass quiz id to fetch the needed quiz
//and then according to X no of questions inside the quiz we will randomly choose X questions  
//and give it to the student
private getRandomQuestions(quizId: mongoose.Types.ObjectId) {
  let quiz: Quiz;
  quiz = await this.getQuizByQuizId(quizId);
  return quiz.questions.sort(() => 0.5 - Math.random()).slice(0, quiz.no_of_questions);
}

//now im done with create and take quiz


//now instructor wants to create a question for a certain module
async generateQuestion(moduleId: mongoose.Types.ObjectId) {
  const question = await this.questionService.create
  });







// For user (student) - only return questions
async findQuizWithQuestions(quizId: mongoose.Types.ObjectId) {
  const quiz = await this.quizModel.findById(quizId).lean();
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  const questions = await this.questionModel
    .find({ _id: { $in: quiz.questions } })
    .lean();

  return {
    questions, // Only questions
  };
}

// For instructor - return both questions and responses
async findQuizWithQuestionsAndResponses(quizId: mongoose.Types.ObjectId) {
  const quiz = await this.quizModel.findById(quizId).lean();
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  const questions = await this.questionModel
    .find({ _id: { $in: quiz.questions } })
    .lean();

  return {
    questions,   // Questions for both instructor and student
    responses: quiz.responses, // Responses only for instructor
  };
}
}
