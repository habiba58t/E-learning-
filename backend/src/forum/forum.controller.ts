import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { threadDocument, Threads } from './threads.schema';
import { Reply, replyDocument } from './reply.schema';
import mongoose, { Types } from 'mongoose';
import { CreateThreadDto } from './dto/create-thread-dto';
import { CreateReplyDto } from './dto/create-reply-dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles, Role } from 'src/auth/decorators/role.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { UpdateThreadDto } from './dto/update-thread.dto';

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






  @Get('/course/:threadId/:username')
async fetchThreadAndCourseById(
  @Param('threadId') threadId: string,
  @Param('username') username: string
) {
  return await this.forumService.getCourseOfthread(threadId, username);
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
    @Delete('threads/:course_code/:threadId') // Route for deleting a thread
    async deleteThread(
        @Param('course_code') course_code: string, // Correct param name
        @Param('threadId') threadId: string // Correct param name
    ) {
        // Validate threadId as a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(threadId)) {
            throw new BadRequestException('Invalid threadId');
        }
    
        // Attempt to delete the thread
        const deletedThread = await this.forumService.deleteThread(
            course_code,
            new mongoose.Types.ObjectId(threadId)
        );
    
        // Handle case where thread was not found
        if (!deletedThread) {
            throw new NotFoundException('Thread not found');
        }
    
        // Return the deleted thread data
        return {
            message: 'Thread successfully deleted',
            thread: deletedThread,
        };
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

    //get reply ids
    @Get('thread/:threadId/replies')
    async getReplies(@Param('threadId') threadId: string): Promise<mongoose.Types.ObjectId[]> {
      // Fetch replies using the service method
      const replies = await this.forumService.getRepliesByThreadId(threadId);
      
      // if (!replies || replies.length === 0) {
      //   throw new NotFoundException('No replies found for this thread');
      // }
  
      // Return the replies (which should be an array of ObjectId's)
      return replies;
    }  



@Get('reply/:replyId')
async getReply(@Param('replyId') replyId: string): Promise<any> {
  const reply = await this.forumService.getReplyById(replyId);

  if (!reply) {
    throw new NotFoundException('Reply not found');
  }

  return reply;  // Return the full reply object
}
@Patch(':course_code/:threadId')
  async updateThread(
    @Param('course_code') course_code:string,
    @Param('threadId') threadId: mongoose.Types.ObjectId,
    @Body() updateThreadDto: UpdateThreadDto
  ) {
    try {
      // Validate ObjectIds
      // if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(threadId)) {
      //   throw new HttpException('Invalid courseId or threadId', HttpStatus.BAD_REQUEST);
      // }

      // Call the service to update the thread
      const updatedThread = await this.forumService.updateForum(
        course_code,
        new Types.ObjectId(threadId),
        updateThreadDto
      );

      if (!updatedThread) {
        throw new HttpException('Thread not found or update failed', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'Thread updated successfully',
        thread: updatedThread,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while updating the thread',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



}