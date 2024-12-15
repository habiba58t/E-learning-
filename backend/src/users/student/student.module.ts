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
import { ContentService } from 'src/content/content.service';
import { ContentSchema } from 'src/content/content.schema';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { QuestionsService } from 'src/questions/questions.service';
import {Notification} from 'src/notification/notification.schema';
import {NotificationSchema} from 'src/notification/notification.schema';
import {NotificationService} from 'src/notification/notification.service';
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
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema}]),
  ],
  providers: [StudentService,CoursesService, UsersService, ProgressService,ResponsesService, NotesService,ModulesService,QuizzesService,ContentService,QuestionsService,NotificationService ],
  controllers: [StudentController],
  exports: [StudentService,CoursesService, UsersService, ProgressService,ResponsesService, NotesService,ModulesService,QuizzesService,ContentService,QuestionsService,NotificationService ],
})
export class StudentModule {}