import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumThread } from './forum.schema';
import { NotificationService } from '/Users/ialiaaah/Documents/swwwww/swww/E-learning-/backend/src/notification/notification/notification.service'; // Import NotificationService

@Injectable()
export class ForumService {
  constructor(
    @InjectModel('ForumThread') private readonly forumModel: Model<ForumThread>,
    private readonly notificationService: NotificationService,  // Inject NotificationService
  ) {}

  // Create a new thread
  async createThread(courseId: string, courseName: string, title: string, creatorId: string): Promise<ForumThread> {
    const newThread = new this.forumModel({
      courseId,
      courseName,
      title,
      creatorId,
    });
    const savedThread = await newThread.save();

    // Notify the creator when a new thread is created
    await this.notificationService.createNotification(
      `You have created a new thread titled: "${title}" in the course: ${courseName}.`,
      creatorId,
    );

    return savedThread;
  }

  // Add a reply to a thread
  async addReply(threadId: string, userId: string, message: string): Promise<ForumThread> {
    const thread = await this.forumModel.findById(threadId);
    if (!thread) throw new Error('Thread not found');

    thread.replies.push({ userId, message, timestamp: new Date() });
    const updatedThread = await thread.save();

    // Notify the thread creator and the user who replied
    await this.notificationService.createNotification(
      `${userId} replied to your thread titled: "${thread.title}".`,
      thread.creatorId,  // Notify thread creator
    );

    return updatedThread;
  }

  // Get threads by course name
  async getThreadsByCourseName(courseName: string): Promise<ForumThread[]> {
    return this.forumModel.find({ courseName }).sort({ timestamp: 1 }).exec();
  }

  // Get a thread by its ID
  async getThreadById(threadId: string): Promise<ForumThread> {
    return this.forumModel.findById(threadId).exec();
  }
}
