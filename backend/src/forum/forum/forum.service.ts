// src/communication/forum/forum.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumThread } from './forum.schema';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel('ForumThread') private readonly forumModel: Model<ForumThread>,
  ) {}

  async createThread(courseId: string, courseName: string, title: string, creatorId: string): Promise<ForumThread> {
    const newThread = new this.forumModel({
      courseId,
      courseName,
      title,
      creatorId,
    });
    return newThread.save();
  }

  async addReply(threadId: string, userId: string, message: string): Promise<ForumThread> {
    return this.forumModel.findByIdAndUpdate(
      threadId,
      { $push: { replies: { userId, message, timestamp: new Date() } } },
      { new: true },
    ).exec();
  }

  async getThreadsByCourseName(courseName: string): Promise<ForumThread[]> {
    return this.forumModel.find({ courseName }).sort({ timestamp: 1 }).exec();
  }

  async getThreadById(threadId: string): Promise<ForumThread> {
    return this.forumModel.findById(threadId).exec();
  }
}
