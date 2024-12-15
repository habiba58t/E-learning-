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
import { Content } from 'src/content/content.schema';
import { ContentService } from 'src/content/content.service';
import { ContentSchema } from 'src/content/content.schema';
import { Progress } from 'src/progress/progress.schema';
import { ProgressSchema } from 'src/progress/progress.schema';
import { ProgressService } from 'src/progress/progress.service';
import { Responses } from 'src/responses/responses.schema';
import { ResponsesSchema } from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { ModuleSchema } from 'src/modules/modules.schema';
import { Notes } from 'src/notes/notes.schema';
import { NoteSchema } from 'src/notes/notes.schema';
import {Notification} from 'src/notification/notification.schema';
import {NotificationSchema} from 'src/notification/notification.schema';
import {NotificationService} from 'src/notification/notification.service';
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
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  controllers: [QuizzesController],
  providers: [StudentService, CoursesService,ModulesService,QuizzesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService,ProgressService,ResponsesService,NotificationService],
  exports: [StudentService, CoursesService,ModulesService,QuizzesService,QuestionsService,NotesService,StudentService,InstructorService,UsersService,ContentService,ProgressService,ResponsesService,NotificationService],
}
)
export class QuizzesModule {}
