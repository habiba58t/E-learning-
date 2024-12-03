import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { MongooseModule } from '@nestjs/mongoose';
//import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import {NotesModule} from './notes/notes.module'
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './users/Admin/logs/logs.module';

@Module({
  imports: [ProgressModule, UsersModule, CoursesModule, ModulesModule, ResponsesModule, QuizzesModule, QuestionsModule,NotesModule,MongooseModule.forRoot('mongodb://localhost:27017/E-Learning'), AuthModule, LogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
