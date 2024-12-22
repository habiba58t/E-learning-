import { Module } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema } from './modules.schema';
import { QuizzesSchema } from '../quizzes/quizzes.schema';
import { QuizzesService } from '../quizzes/quizzes.service';
import { QuestionsService } from 'src/questions/questions.service';
import { NotesService } from 'src/notes/notes.service';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { NoteSchema } from 'src/notes/notes.schema';
import { Content } from 'src/content/content.schema';
import { ContentService } from 'src/content/content.service';
import { contentDocument } from 'src/content/content.schema';
import { ContentSchema } from 'src/content/content.schema';
import { UsersSchema } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { StudentService } from 'src/users/student/student.service';
import { CoursesService } from 'src/courses/courses.service';
import { ProgressService } from 'src/progress/progress.service';
import { CoursesSchema } from 'src/courses/courses.schema';
import { ProgressSchema } from 'src/progress/progress.schema';
import { Responses, ResponsesSchema } from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { Quiz} from '../quizzes/quizzes.schema';
import { Question } from 'src/questions/questions.schema';
import { Notes } from 'src/notes/notes.schema';
import { Users } from 'src/users/users.schema';
import {Notification} from 'src/notification/notification.schema';
import {NotificationSchema} from 'src/notification/notification.schema';
import {NotificationService} from 'src/notification/notification.service';
import { GroupChatService } from 'src/group-chat/group-chat.service';
import { GroupChat, GroupChatSchema } from 'src/group-chat/group-chat.schema';
import { Message, MessageSchema } from 'src/message/message.schema';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: GroupChat.name, schema: GroupChatSchema }]), 
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), 



  ],
  controllers: [ModulesController],
  providers: [ResponsesService, NotesService, UsersService, StudentService,ModulesService,QuizzesService,QuestionsService,NotesService,ContentService, CoursesService, ProgressService,NotificationService,GroupChatService,MessageService],
  exports: [ResponsesService, UsersService, StudentService, ModulesService,QuizzesService,QuestionsService,NotesService,ContentService, CoursesService, ProgressService, NotesService,NotificationService,GroupChatService,MessageService]
})

export class ModulesModule {}