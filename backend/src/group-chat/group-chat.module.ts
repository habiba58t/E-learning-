import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef } from '@nestjs/common';
import { GroupChatController } from './group-chat.controller';
import { GroupChatService } from './group-chat.service';
import { GroupChat } from './group-chat.schema';
import { Message, MessageSchema } from '../message/message.schema';
import { MessageService } from '../message/message.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationSchema } from 'src/notification/notification.schema';
import { Notification } from 'src/notification/notification.schema';
import { UsersService } from 'src/users/users.service';
import { Users, UsersSchema } from 'src/users/users.schema';
import { CoursesService } from 'src/courses/courses.service';
import { Courses, CoursesSchema } from 'src/courses/courses.schema';
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
import { ContentSchema } from 'src/modules/content/content.schema';
import { ContentService } from 'src/modules/content/content.service';
import { StudentService } from 'src/users/student/student.service';
import { GroupChatSchema} from './group-chat.schema';
import { MessageModule } from 'src/message/message.module';
@Module({
    imports: [
       MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
       MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema}]),
       MongooseModule.forFeature([{ name: GroupChat.name, schema: GroupChatSchema}]),
       MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema}]),
       MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema}]),
       MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema}]),
       MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
       MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
       MongooseModule.forFeature([{ name: Question.name, schema: QuestionsSchema }]),
       MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
       MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),
       MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
       forwardRef(() => MessageModule), // Avoid circular dependencies
    

      ],
      controllers: [GroupChatController], // Register GroupChatController
      providers: [GroupChatService, MessageService,NotificationService,UsersService,CoursesService,ProgressService,ModulesService,ContentService, QuizzesService,NotesService,ResponsesService,QuestionsService,StudentService], // Register services
      exports: [GroupChatService,NotificationService,MessageService,UsersService,CoursesService,ProgressService,ModulesService,ContentService, QuizzesService,NotesService,ResponsesService,QuestionsService,StudentService ] // Export GroupChatService for use in other modules
})
export class GroupChatModule {}
