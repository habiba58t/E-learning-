import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef } from '@nestjs/common';
//import { GroupChatService } from 'src/group-chat/group-chat.service';
//import { GroupChat } from 'src/group-chat/group-chat.schema';
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
import { ContentSchema } from 'src/content/content.schema';
import { ContentService } from 'src/content/content.service';
import { StudentService } from 'src/users/student/student.service';
//import { GroupChatSchema } from 'src/group-chat/group-chat.schema';
import { MessageSchema } from './message.schema';
import { Message } from './message.schema';
import { MessageController } from './message.controller';



@Module({
   imports: [
      MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
   ],
  controllers: [MessageController],
  providers: [MessageService],
   exports: [MessageService]
})
export class MessageModule {}