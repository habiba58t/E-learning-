import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { InstructorModule } from './instructor/instructor.module';
import { StudentModule } from './student/student.module';
import { UsersSchema } from './users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { CoursesSchema } from 'src/courses/courses.schema';
import { ProgressSchema } from 'src/progress/progress.schema';
import { Progress } from 'src/progress/progress.schema';
import { ProgressService } from 'src/progress/progress.service';
import { CoursesService } from 'src/courses/courses.service';
import { ModuleSchema } from 'src/modules/modules.schema';
import { ResponsesSchema } from 'src/responses/responses.schema';
import { ModulesService } from 'src/modules/modules.service';
import { ResponsesService } from 'src/responses/responses.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { ContentSchema } from 'src/content/content.schema';
import { ContentService } from 'src/content/content.service';
import { QuizzesSchema } from 'src/quizzes/quizzes.schema';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { StudentService } from './student/student.service';
import { NoteSchema } from 'src/notes/notes.schema';
import { NotesService } from 'src/notes/notes.service';
import { Quiz } from 'src/quizzes/quizzes.schema';
import {Notification} from 'src/notification/notification.schema';
import {NotificationSchema} from 'src/notification/notification.schema';
import {NotificationService} from 'src/notification/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Responses', schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]), 
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), 
  ],
  providers: [
    StudentService,
    QuestionsService,
    QuizzesService,
    NotesService,
    ContentService,
    UsersService,
    CoursesService,
    ProgressService,
    ResponsesService,
    ModulesService,
    NotificationService,
  ],
  controllers: [UsersController],
  exports: [
    StudentService,
    QuestionsService,
    QuizzesService,
    ContentService,
    NotesService,
    MongooseModule,
    UsersService,
    CoursesService,
    ProgressService,
    ResponsesService,
    ModulesService,
    NotificationService,
  ],
})
export class UsersModule {}