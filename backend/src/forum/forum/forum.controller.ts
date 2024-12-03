// src/communication/forum/forum.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ForumService } from './forum.service';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('create')
  async createThread(
    @Body() body: { courseId: string; courseName: string; title: string; creatorId: string },
  ) {
    return this.forumService.createThread(body.courseId, body.courseName, body.title, body.creatorId);
  }

  @Post(':threadId/reply')
  async addReply(
    @Param('threadId') threadId: string,
    @Body() body: { userId: string; message: string },
  ) {
    return this.forumService.addReply(threadId, body.userId, body.message);
  }

  @Get(':courseName')
  async getThreadsByCourseName(@Param('courseName') courseName: string) {
    return this.forumService.getThreadsByCourseName(courseName);
  }

  @Get('thread/:threadId')
  async getThreadById(@Param('threadId') threadId: string) {
    return this.forumService.getThreadById(threadId);
  }
}
