import { Module } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema } from './modules.schema';
import { QuizzesSchema } from '../quizzes/quizzes.schema';
import { QuizzesService } from '../quizzes/quizzes.service';
import { QuestionsService } from 'src/questions/questions.service';
import { NotesService } from 'src/notes/notes.service';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { NoteSchema } from 'src/notes/notes.schema';
import { ContentModule } from './content/content.module';
import { ContentSchema } from './content/content.schema';
import { ContentService } from './content/content.service';
import { UsersSchema } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { StudentService } from 'src/users/student/student.service';
import { CoursesService } from 'src/courses/courses.service';
import { ProgressService } from 'src/progress/progress.service';
import { CoursesSchema } from 'src/courses/courses.schema';
import { ProgressSchema } from 'src/progress/progress.schema';
import { Responses, ResponsesSchema } from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),




  ],
  controllers: [ModulesController],
  providers: [ResponsesService, NotesService, UsersService, StudentService,ModulesService,QuizzesService,QuestionsService,NotesService,ContentService, CoursesService, ProgressService],
  exports: [ResponsesService, UsersService, StudentService, ModulesService,QuizzesService,QuestionsService,NotesService,ContentService, CoursesService, ProgressService, NotesService]
})

export class ModulesModule {}
