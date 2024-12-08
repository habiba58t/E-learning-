// src/communication/forum/forum.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { Threads, ThreadSchema } from './threads.schema';
import { Reply, replySchema } from './reply.schema';
import { Courses, CoursesSchema } from 'src/courses/courses.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Threads.name, schema: ThreadSchema }]),
    MongooseModule.forFeature([{ name: Reply.name, schema: replySchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
  ],
  controllers: [ForumController],
  providers: [ForumService], 
})
export class ForumModule {}
