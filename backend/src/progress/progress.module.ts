import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { Progress, ProgressSchema } from './progress.schema';
import { CoursesModule } from '../courses/courses.module'; // Import CoursesModule
import { UsersModule } from 'src/users/users.module';
import { ModulesModule } from 'src/modules/modules.module';
import { Courses, CoursesSchema } from 'src/courses/courses.schema';
import { Quiz, QuizzesSchema } from 'src/quizzes/quizzes.schema';
import { Users, UsersSchema } from 'src/users/users.schema';
import { ModuleSchema } from 'src/modules/modules.schema';
import { CoursesService } from 'src/courses/courses.service';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { ModulesService } from 'src/modules/modules.service';
import { UsersService } from 'src/users/users.service';
import { Question } from 'src/questions/questions.schema';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { ResponsesSchema } from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { Responses } from 'src/responses/responses.schema';
import { StudentService } from 'src/users/student/student.service';
import { Content } from 'src/content/content.schema';
import { ContentSchema } from 'src/content/content.schema';
import { ContentService } from 'src/content/content.service';
import { Notes } from 'src/notes/notes.schema';
import { NotesService } from 'src/notes/notes.service';
import { NoteSchema } from 'src/notes/notes.schema';
import {Notification} from 'src/notification/notification.schema';
import {NotificationSchema} from 'src/notification/notification.schema';
import {NotificationService} from 'src/notification/notification.service';
import { GroupChatService } from 'src/group-chat/group-chat.service';
import { GroupChat, GroupChatSchema } from 'src/group-chat/group-chat.schema';
import { MessageService } from 'src/message/message.service';
import { Message, MessageSchema } from 'src/message/message.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: GroupChat.name, schema: GroupChatSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema}]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService,CoursesService,QuizzesService,ModulesService,UsersService,QuestionsService,ResponsesService,StudentService,ContentService,NotesService,NotificationService,GroupChatService,MessageService ],
  exports:[ProgressService,CoursesService,QuizzesService,ModulesService,UsersService,QuestionsService,ResponsesService,StudentService,ContentService,NotesService,NotificationService,GroupChatService,MessageService ],
})
export class ProgressModule {}
