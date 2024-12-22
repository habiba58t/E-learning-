// src/communication/forum/forum.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { Threads, ThreadSchema } from './threads.schema';
import { Reply, replySchema } from './reply.schema';
import { Courses, CoursesSchema } from 'src/courses/courses.schema';
import { Users, UsersSchema } from 'src/users/users.schema';
import { forwardRef } from '@nestjs/common';
import { GroupChatService } from 'src/group-chat/group-chat.service';
import { GroupChat, GroupChatSchema } from 'src/group-chat/group-chat.schema';
import { MessageService } from '../message/message.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationSchema } from 'src/notification/notification.schema';
import { Notification } from 'src/notification/notification.schema';
import { UsersService } from 'src/users/users.service';
import { CoursesService } from 'src/courses/courses.service';
import { ProgressService } from 'src/progress/progress.service';
import { Progress, ProgressSchema } from 'src/progress/progress.schema';
import { ModulesService } from 'src/modules/modules.service';
import { ModuleSchema } from 'src/modules/modules.schema';
import { QuizzesSchema } from 'src/quizzes/quizzes.schema';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { Quiz} from '../quizzes/quizzes.schema';
import { Question } from 'src/questions/questions.schema';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { NoteSchema } from 'src/notes/notes.schema';
import { NotesService } from 'src/notes/notes.service';
import { Notes } from 'src/notes/notes.schema';
import { Responses, ResponsesSchema } from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { ContentSchema } from 'src/content/content.schema';
import { ContentService } from 'src/content/content.service';
import { StudentService } from 'src/users/student/student.service';
import { Message, MessageSchema } from 'src/message/message.schema';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Threads.name, schema: ThreadSchema }]),
    MongooseModule.forFeature([{ name: Reply.name, schema: replySchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: GroupChat.name, schema: GroupChatSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),

  ],
  controllers: [ForumController],
  providers: [ForumService, NotificationService, ResponsesService, NotesService, UsersService, StudentService,ModulesService,QuizzesService,QuestionsService,NotesService,ContentService, CoursesService, ProgressService,NotificationService,GroupChatService,MessageService],

})
export class ForumModule {}
