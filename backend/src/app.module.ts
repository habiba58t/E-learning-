import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
<<<<<<< HEAD
import { TestModule } from './test/test.module';

@Module({
  imports: [ProgressModule, UsersModule, CoursesModule, ModulesModule, TestModule],
=======
<<<<<<< HEAD
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [ProgressModule, UsersModule, CoursesModule, ModulesModule, QuizzesModule, QuestionsModule],
=======
import { ResponsesModule } from './responses/responses.module';

@Module({
  imports: [ProgressModule, UsersModule, CoursesModule, ModulesModule, ResponsesModule],
>>>>>>> 141e217546d4e1454e6f994358b48356cf6e5037
>>>>>>> eefc138bfc7a5cb319ae6c82587476ff50628665
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
