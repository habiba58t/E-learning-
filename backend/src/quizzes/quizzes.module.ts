// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { QuizzesController } from './quizzes.controller';
// import { QuizzesService } from './quizzes.service';
// import { Quiz, QuizzesSchema } from './quizzes.schema';
// import { Courses, CoursesSchema } from 'src/courses/courses.schema';
// import { Question, QuestionsSchema } from 'src/questions/questions.schema';
// import { Users, UsersSchema } from 'src/users/users.schema';
// import { CoursesService } from 'src/courses/courses.service';
// import { ModulesService } from 'src/modules/modules.service';
// import { QuestionsService } from 'src/questions/questions.service';
// import { NotesService } from 'src/notes/notes.service';
// import { StudentService } from 'src/users/student/student.service';
// import { InstructorService } from 'src/users/instructor/instructor.service';
// import { UsersService } from 'src/users/users.service';
// import { ContentService } from 'src/modules/content/content.service';
// import { ResponsesSchema } from 'src/responses/responses.schema';
// import { ModuleSchema } from 'src/modules/modules.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
//     MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
//     MongooseModule.forFeature([{ name: Question.name, schema: QuestionsSchema }]),
//     MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
//     MongooseModule.forFeature([{ name: Response.name, schema: ResponsesSchema }]),
//     MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
//   ],
//   controllers: [QuizzesController],
//   providers: [CoursesService,ModulesService,QuizzesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService],
//   exports: [QuizzesService,CoursesService,ModulesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService], // Exporting for potential use in other modules
// })
// export class QuizzesModule {}
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
import { Progress } from 'src/progress/progress.schema';
import { ProgressSchema } from 'src/progress/progress.schema';
import { ProgressService } from 'src/progress/progress.service';
import { Responses } from 'src/responses/responses.schema';
import { ResponsesSchema } from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { ModuleSchema } from 'src/modules/modules.schema';
import { Content } from 'src/modules/content/content.schema';
import { ContentSchema } from 'src/modules/content/content.schema';
import { Notes } from 'src/notes/notes.schema';
import { NoteSchema } from 'src/notes/notes.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
  ],
  controllers: [QuizzesController],
  providers: [StudentService, CoursesService,ModulesService,QuizzesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService,ProgressService,ResponsesService],
  exports: [StudentService, CoursesService,ModulesService,QuizzesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService,ProgressService,ResponsesService],
}
)
export class QuizzesModule {}
