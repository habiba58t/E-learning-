import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationService {
  deleteNotification(notificationId: string) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
  ) {}

  // Create a notification
  async createNotification(message: string, userName: string): Promise<Notification> {
    const notification = new this.notificationModel({
      message,
      userName,
      isRead: false,
    });
    return notification.save();
  }

  // Get notifications for a user
  async getNotifications(userName: string): Promise<Notification[]> {
    return this.notificationModel.find({ userName }).sort({ createdAt: -1 }).exec();
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }
}
