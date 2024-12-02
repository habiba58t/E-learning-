import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { CoursesSchema } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { UsersSchema } from '../users.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'student', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'course', schema: CoursesSchema }]),
  ],
  providers: [StudentService],
  controllers: [StudentController,CoursesService],
  exports: [StudentService,CoursesService]
})
export class StudentModule {}
