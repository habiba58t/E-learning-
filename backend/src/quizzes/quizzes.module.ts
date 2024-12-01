import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz, QuizzesSchema } from './quizzes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService], // Exporting for potential use in other modules
})
export class QuizzesModule {}
