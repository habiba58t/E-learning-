import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { Progress, ProgressSchema } from './progress.schema';
import { CoursesModule } from '../courses/courses.module'; // Import CoursesModule
import { UsersModule } from 'src/users/users.module';
import { ModulesModule } from 'src/modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
    CoursesModule,
    // Add CoursesModule here to make CoursesService available
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
