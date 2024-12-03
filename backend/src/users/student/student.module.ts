import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { CoursesSchema } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { UsersSchema } from '../users.schema';
import { Progress, ProgressSchema } from 'src/progress/progress.schema';
import { Responses, ResponsesSchema } from 'src/responses/responses.schema';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { ProgressModule } from 'src/progress/progress.module';
import { ResponsesModule } from 'src/responses/responses.module';
import { NoteSchema } from 'src/notes/notes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'student', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'course', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Responses', schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
  ],
  providers: [StudentService],
  controllers: [StudentController,CoursesService],
  exports: [StudentService,CoursesService]
})
export class StudentModule {}
