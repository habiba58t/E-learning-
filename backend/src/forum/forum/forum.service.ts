import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumThread } from './forum.schema';
import { NotificationService } from '/Users/ialiaaah/Documents/swwwww/swww/E-learning-/backend/src/notification/notification/notification.service'; // Adjust the import path as necessary

@Injectable()
export class ForumService {
  constructor(
    @InjectModel('ForumThread') private readonly forumModel: Model<ForumThread>,
    private readonly notificationService: NotificationService, // Inject NotificationService
  ) {}

  // Create a new thread
  async createThread(
    courseId: string,
    courseName: string,
    title: string,
    creatorId: string,
  ): Promise<ForumThread> {
    const newThread = new this.forumModel({
      courseId,
      courseName,
      title,
      creatorId,
    });

    const savedThread = await newThread.save();

    // Notify the creator about the thread creation
    await this.notificationService.createNotification(
      `You have created a new thread titled: "${title}" in the course: ${courseName}.`,
      creatorId,
    );

    return savedThread;
  }

  // Add a reply to a thread
  async addReply(
    threadId: string,
    userId: string,
    message: string,
  ): Promise<ForumThread> {
    const thread = await this.forumModel.findById(threadId);
    if (!thread) throw new Error('Thread not found');

    thread.replies.push({ userId, message, timestamp: new Date() });
    const updatedThread = await thread.save();

    // Notify participants (creator and all repliers except the current user)
    const participants = new Set(
      thread.replies.map((reply) => reply.userId).concat(thread.creatorId),
    );
    participants.delete(userId); // Exclude the current replier

    for (const participant of participants) {
      await this.notificationService.createNotification(
        `${userId} replied to the thread titled: "${thread.title}".`,
        participant,
      );
    }

    return updatedThread;
  }

  // Get threads by course name
  async getThreadsByCourseName(courseName: string): Promise<ForumThread[]> {
    const threads = await this.forumModel.find({ courseName }).sort({ timestamp: 1 }).exec();
    if (!threads.length) throw new Error(`No threads found for course: ${courseName}`);
    return threads;
  }

  // Get a thread by its ID
  async getThreadById(threadId: string): Promise<ForumThread> {
    const thread = await this.forumModel.findById(threadId).exec();
    if (!thread) throw new Error('Thread not found');
    return thread;
  }
}
