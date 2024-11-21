import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [ProgressModule, UsersModule, CoursesModule, ModulesModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
