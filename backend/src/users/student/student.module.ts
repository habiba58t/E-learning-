// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { StudentService } from './student.service';
// import { StudentController } from './student.controller';
// import { CoursesSchema } from 'src/courses/courses.schema';
// import { CoursesService } from 'src/courses/courses.service';
// import { UsersSchema } from '../users.schema';
// import { Progress, ProgressSchema } from 'src/progress/progress.schema';
// import { Responses, ResponsesSchema } from 'src/responses/responses.schema';
// import { CoursesModule } from 'src/courses/courses.module';
// import { UsersModule } from 'src/users/users.module';
// import { ProgressModule } from 'src/progress/progress.module';
// import { ResponsesModule } from 'src/responses/responses.module';
// import { NoteSchema } from 'src/notes/notes.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: 'student', schema: UsersSchema }]),
//     MongooseModule.forFeature([{ name: 'course', schema: CoursesSchema }]),
//     MongooseModule.forFeature([{ name: 'progress', schema: ProgressSchema }]),
//     MongooseModule.forFeature([{ name: 'Responses', schema: ResponsesSchema }]),
//     MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
//   ],
//   providers: [StudentService],
//   controllers: [StudentController,CoursesService],
//   exports: [StudentService,CoursesService]
// })
// export class StudentModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { CoursesSchema } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { UsersSchema } from '../users.schema';
import { Progress, ProgressSchema } from 'src/progress/progress.schema';
import { Responses, ResponsesSchema } from 'src/responses/responses.schema';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { ProgressModule } from 'src/progress/progress.module';
import { ResponsesModule } from 'src/responses/responses.module';
import { NoteSchema } from 'src/notes/notes.schema';
import { ProgressService } from 'src/progress/progress.service';
import { UsersService } from '../users.service';
import { ResponsesService } from 'src/responses/responses.service';
import { NotesService } from 'src/notes/notes.service';
import { ModuleSchema } from 'src/modules/modules.schema';
import { ModulesService } from 'src/modules/modules.service';
import { QuizzesSchema } from 'src/quizzes/quizzes.schema';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { ContentSchema } from 'src/modules/content/content.schema';
import { ContentService } from 'src/modules/content/content.service';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { QuestionsService } from 'src/questions/questions.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Responses', schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema}]),
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: 'Content', schema:ContentSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionsSchema}]),
  ],
  providers: [StudentService,CoursesService, UsersService, ProgressService,ResponsesService, NotesService,ModulesService,QuizzesService,ContentService,QuestionsService ],
  controllers: [StudentController],
  exports: [StudentService,CoursesService, UsersService, ProgressService,ResponsesService, NotesService,ModulesService,QuizzesService,ContentService,QuestionsService ],
})
export class StudentModule {}