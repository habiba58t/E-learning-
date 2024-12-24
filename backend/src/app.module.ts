import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesModule } from './responses/responses.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import {NotesModule} from './notes/notes.module'
import { LogModule } from './log/log.module';
import { StudentModule } from './users/student/student.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { ForumModule } from './forum/forum.module';
import { PrivateChatController } from './private-chat/private-chat.controller';
import { PrivateChatService } from './private-chat/private-chat.service';
import { PrivateChatModule } from './private-chat/private-chat.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupModule } from './backups/backup.module';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';

@Module({
  imports: [PrivateChatModule, MessageModule, ProgressModule, UsersModule, CoursesModule, ModulesModule, ResponsesModule, QuizzesModule, QuestionsModule,StudentModule,NotesModule,LogModule,
    MongooseModule.forRoot('mongodb+srv://projectdb:12345@e-learning.6bu6g.mongodb.net/E-learning-'), NotificationModule, ForumModule, PrivateChatModule, ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'), // path to your 'uploads' folder
      serveRoot: '/uploads', // URL path where static files are served
    }),GroupChatModule,ScheduleModule.forRoot(), BackupModule, ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Makes the config accessible throughout the app
    }),ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}