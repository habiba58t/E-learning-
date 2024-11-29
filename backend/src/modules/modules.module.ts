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


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
   
  ],
  controllers: [ModulesController],
  providers: [ModulesService,QuizzesService,QuestionsService,NotesService],
  exports: [ModulesService,QuizzesService,QuestionsService,NotesService]
})
export class ModulesModule {}
