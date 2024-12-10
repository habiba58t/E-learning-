import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { threadDocument, Threads } from './threads.schema';
import { replyDocument } from './reply.schema';
import mongoose, { Types } from 'mongoose';
import { CreateThreadDto } from './dto/create-thread-dto';
import { CreateReplyDto } from './dto/create-reply-dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles, Role } from 'src/auth/decorators/role.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

@Controller('forum')
export class ForumController {
    
    constructor(private readonly forumService: ForumService) {}


    @Get()
    async findAllForums(): Promise<threadDocument[]> {
      return this.forumService.findAllForums();
    }
    @Get('/course/:courseCode')
     async findThreadsByCourseCode(@Param('courseCode') courseCode: string,): Promise<threadDocument[]> {
      return this.forumService.findThreadByCourseCode(courseCode);
    }

  @Get('/course/:courseCode/title')
  async findThreadByTitle(@Param('courseCode') courseCode: string,@Query('title') title: string,): Promise<threadDocument> {
    if (!title) {
      throw new NotFoundException('Title parameter is required');
    }
    return this.forumService.findThreadByTitle(courseCode, title);
  }



  //get by course code bec by mongo course id was not working and i think can't be passw]ed as a parameter in the frontend
  //so from the course code i got the mongo id and got thee thread that is in it
  // @Get('threads/by-course-code/:courseCode/:title') //done and tested
  // async getThreadByCourseCode(@Param('courseCode') courseCode: string,@Param('title') title: string): Promise<Threads> {
  //   const thread = await this.forumService.findThreadByCourseCode(courseCode, title);

  //   // If no thread found, throw NotFoundException
  //   if (!thread) {
  //     throw new NotFoundException('Thread not found');
  //   }

  //   return thread;
  // }
    @UseGuards(AuthGuard, AuthorizationGuard)
    @Roles(Role.User, Role.Instructor)
    @Post('threads') //done still have problem in adding the thread in the array of threads of user
    async createThread(@Req() { user }, @Body() createThreadDto: CreateThreadDto) {
      return await this.forumService.createForum(user, createThreadDto);
    }
    
    //must put constraint that only user who created the thread can delete it
    @Delete('threads/:courseId/:threadId') //tested and worked
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

    @UseGuards(AuthGuard, AuthorizationGuard)
    @Roles(Role.User, Role.Instructor)
    @Post('replies') //done and tested
    async createReply(@Req() { user },@Body() createReplyDto: CreateReplyDto) {
      return await this.forumService.createReply(createReplyDto,user);
    }

  
//must put constraint that on;y user who created the reply can delete it
    @Delete('replies/:threadId/:replyId') //working and tested
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
