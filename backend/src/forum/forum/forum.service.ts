// src/communication/forum/forum.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumThread } from './forum.schema';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel('Forum') private readonly forumModel: Model<ForumThread>,
  ) {}

  // Create a new forum thread
  async createThread(courseId: string, courseName: string, title: string, creatorId: string): Promise<ForumThread> {
    const newThread = new this.forumModel({
      courseId,
      courseName,
      title,
      creatorId,
    });
    return newThread.save();  // Save to MongoDB
  }

  // Add a reply to a thread
  async addReply(threadId: string, userId: string, message: string): Promise<ForumThread> {
    return this.forumModel.findByIdAndUpdate(
      threadId,
      { $push: { replies: { userId, message, timestamp: new Date() } } },
      { new: true },
    );
  }

  // Get all threads by course name
  async getThreadsByCourseName(courseName: string): Promise<ForumThread[]> {
    return this.forumModel.find({ courseName }).sort({ timestamp: 1 }).exec();
  }

  // Get a specific thread by ID
  async getThreadById(threadId: string): Promise<ForumThread> {
    return this.forumModel.findById(threadId).exec();
  }
}
