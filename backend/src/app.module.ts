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

@Module({
  imports: [ProgressModule, UsersModule, CoursesModule, ModulesModule, ResponsesModule, QuizzesModule, QuestionsModule,StudentModule,NotesModule,LogModule,MongooseModule.forRoot('mongodb://localhost:27017/E-Learning')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
