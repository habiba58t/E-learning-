// src/communication/forum/forum.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { Threads, ThreadSchema } from './threads.schema';
import { Reply, replySchema } from './reply.schema';
import { Courses, CoursesSchema } from 'src/courses/courses.schema';
import { Users, UsersSchema } from 'src/users/users.schema';
import { NotificationService } from 'src/notification/notification.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Threads.name, schema: ThreadSchema }]),
    MongooseModule.forFeature([{ name: Reply.name, schema: replySchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    
  ],
  controllers: [ForumController],
  providers: [ForumService], 
})
export class ForumModule {}
