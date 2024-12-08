import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionsSchema } from './questions.schema';
import { ModuleSchema } from 'src/modules/modules.schema';
import { Quiz, QuizzesSchema } from 'src/quizzes/quizzes.schema';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { ModulesService } from 'src/modules/modules.service';
import { Users, UsersSchema } from 'src/users/users.schema';
import { ResponsesSchema } from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { UsersService } from 'src/users/users.service';
import { Responses } from 'src/responses/responses.schema';
import { Courses } from 'src/courses/courses.schema';
import { CoursesSchema } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { Progress } from 'src/progress/progress.schema';
import { ProgressSchema } from 'src/progress/progress.schema';
import { ProgressService } from 'src/progress/progress.service';
import { StudentService } from 'src/users/student/student.service';
import { Content } from 'src/modules/content/content.schema';
import { ContentSchema } from 'src/modules/content/content.schema';
import { ContentService } from 'src/modules/content/content.service';
import { Notes } from 'src/notes/notes.schema';
import { NoteSchema } from 'src/notes/notes.schema';
import { NotesService } from 'src/notes/notes.service';
import {Notification} from 'src/notification/notification.schema';
import {NotificationSchema} from 'src/notification/notification.schema';
import {NotificationService} from 'src/notification/notification.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService,QuizzesService,ModulesService,ResponsesService,UsersService,CoursesService,ProgressService,StudentService,ContentService,NotesService,NotificationService],
  exports: [QuizzesService,QuestionsService,ModulesService,ResponsesService,UsersService,CoursesService,ProgressService,StudentService,ContentService,NotesService,NotificationService]
})
export class QuestionsModule {}
