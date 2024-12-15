import { forwardRef, Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ModulesService } from 'src/modules/modules.service';
import { ModulesController } from 'src/modules/modules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from './courses.schema';
import { ModulesModule } from '../modules/modules.module'; 
import { ModuleSchema } from '../modules/modules.schema';
import { QuizzesSchema } from '../quizzes/quizzes.schema';
import { QuizzesService } from '../quizzes/quizzes.service';
import { QuestionsService } from 'src/questions/questions.service';
import { NotesService } from 'src/notes/notes.service';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { NoteSchema } from 'src/notes/notes.schema';
import { UsersSchema } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { StudentService } from 'src/users/student/student.service';
import { InstructorService } from 'src/users/instructor/instructor.service';
import { Content } from 'src/content/content.schema';
import { ContentService } from 'src/content/content.service';
import { contentDocument } from 'src/content/content.schema';
import { ContentSchema } from 'src/content/content.schema';
import { Responses, ResponsesSchema } from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { Progress, ProgressSchema } from 'src/progress/progress.schema';
import { ProgressService } from 'src/progress/progress.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Notes } from 'src/notes/notes.schema';
import {Notification} from 'src/notification/notification.schema';
import {NotificationSchema} from 'src/notification/notification.schema';
import {NotificationService} from 'src/notification/notification.service';
import { NotificationModule } from 'src/Notification/Notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    forwardRef(() => AuthModule), // Resolve circular dependency
    forwardRef(() => UsersModule), // Resolve circular dependency
    forwardRef(() => NotificationModule),
  ],

  providers: [ProgressService, NotesService, ResponsesService, ModulesService, CoursesService,ModulesService,QuizzesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService,NotificationService],
  controllers: [CoursesController],
  exports: [ProgressService, NotesService, ResponsesService, ModulesService, CoursesService,ModulesService,QuizzesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService,NotificationService],
})
export class CoursesModule {}