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
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { ForumModule } from './forum/forum.module';

@Module({
  imports: [ProgressModule, UsersModule, CoursesModule, ModulesModule, ResponsesModule, QuizzesModule, QuestionsModule,StudentModule,NotesModule,LogModule,
    MongooseModule.forRoot('mongodb+srv://projectdb:12345@e-learning.6bu6g.mongodb.net/E-learning-'), NotificationModule, ChatModule, MessageModule, ForumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
