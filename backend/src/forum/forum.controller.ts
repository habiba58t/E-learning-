import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ForumService } from './forum.service';
import { threadDocument, Threads } from './threads.schema';
import { replyDocument } from './reply.schema';
import mongoose from 'mongoose';
import { CreateThreadDto } from './dto/create-thread-dto';
import { CreateReplyDto } from './dto/create-reply-dto';

@Controller('forum')
export class ForumController {
    
    constructor(private readonly forumService: ForumService) {}


    @Get('threads/:courseId/:title')
    async getThread(@Param('courseId') courseId: string,@Param('title') title: string,){
        const thread = await this.forumService.findThread(new mongoose.Types.ObjectId(courseId),title);
          if (!thread) {
            throw new NotFoundException('Thread not found');
          }
          return thread;   
    }

    @Post('threads')
    async createThread(@Body() createThreadDto: CreateThreadDto) {
      return await this.forumService.createForum(createThreadDto);
    }

    @Delete('threads/:courseId/:threadId')
    async deleteThread(@Param('courseId') courseId: string,@Param('threadId') threadId: string,) {
    const deletedThread = await this.forumService.deleteThread(
      new mongoose.Types.ObjectId(courseId),
      new mongoose.Types.ObjectId(threadId),
    );
    if (!deletedThread) {
      throw new NotFoundException('Thread not found');
    }
    return deletedThread;
  }

    @Post('replies')
    async createReply(@Body() createReplyDto: CreateReplyDto) {
      return await this.forumService.createReply(createReplyDto);
    }
    @Delete('replies/:threadId/:replyId')
    async deleteReply(@Param('threadId') threadId: string,@Param('replyId') replyId: string)
     {
      const updatedThread = await this.forumService.deleteReplay(
        new mongoose.Types.ObjectId(threadId),
        new mongoose.Types.ObjectId(replyId),
      );
      if (!updatedThread) {
        throw new NotFoundException('Reply not found in the thread');
      }
      return updatedThread;
    }


}
