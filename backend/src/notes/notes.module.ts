// import { Module } from '@nestjs/common';
// import { NotesService } from './notes.service';
// import { NotesController } from './notes.controller';
// import { Notes,NoteSchema } from './notes.schema';
// import { MongooseModule } from '@nestjs/mongoose';


// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
//   ],
  
//   providers: [NotesService],
//   controllers: [NotesController],
//   exports: [NotesService]
// })
// export class NotesModule {}
import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { UsersSchema } from 'src/users/users.schema';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { NoteSchema } from './notes.schema';
import { CoursesSchema } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { ProgressSchema } from 'src/progress/progress.schema';
import { ProgressService } from 'src/progress/progress.service';
import { ModuleSchema } from 'src/modules/modules.schema';
import { ModulesService } from 'src/modules/modules.service';
import { QuizzesSchema } from 'src/quizzes/quizzes.schema';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { QuestionsService } from 'src/questions/questions.service';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { ResponsesSchema } from 'src/responses/responses.schema';
import { ContentSchema } from 'src/modules/content/content.schema';
import { ContentService } from 'src/modules/content/content.service';
import { StudentService } from 'src/users/student/student.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema}]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: 'Responses', schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema}]),



  ],
  providers: [NotesService, UsersService,CoursesService,ProgressService,ModulesService,QuizzesService,QuestionsService,ResponsesService,ContentService,StudentService ],
  controllers: [NotesController],
  exports: [NotesService, UsersService,CoursesService,ProgressService,ModulesService,QuizzesService,QuestionsService,ResponsesService,ContentService,StudentService ]
})
export class NotesModule {}