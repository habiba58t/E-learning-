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
import { ProgressService } from 'src/progress/progress.service';
import { UsersService } from '../users.service';
import { ResponsesService } from 'src/responses/responses.service';
import { NotesService } from 'src/notes/notes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Responses', schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]),
  ],
  providers: [StudentService,CoursesService, UsersService, ProgressService,ResponsesService, NotesService],
  controllers: [StudentController],
  exports: [StudentService,CoursesService, UsersService, ProgressService,ResponsesService, NotesService],
})
export class StudentModule {}