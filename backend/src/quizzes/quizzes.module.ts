import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz, QuizzesSchema } from './quizzes.schema';
import { Courses, CoursesSchema } from 'src/courses/courses.schema';
import { Question, QuestionsSchema } from 'src/questions/questions.schema';
import { Users, UsersSchema } from 'src/users/users.schema';
import { CoursesService } from 'src/courses/courses.service';
import { ModulesService } from 'src/modules/modules.service';
import { QuestionsService } from 'src/questions/questions.service';
import { NotesService } from 'src/notes/notes.service';
import { StudentService } from 'src/users/student/student.service';
import { InstructorService } from 'src/users/instructor/instructor.service';
import { UsersService } from 'src/users/users.service';
import { ContentService } from 'src/modules/content/content.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [QuizzesController],
  providers: [StudentService, CoursesService,ModulesService,QuizzesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService],
  exports: [StudentService, QuizzesService, QuizzesController], // Exporting for potential use in other modules
})
export class QuizzesModule {}
