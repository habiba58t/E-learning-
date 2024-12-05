import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Endpoint to create a notification
  @Post()
  async createNotification(
    @Body() body: { message: string; userName: string },
  ) {
    // Create a new notification for a user
    const notification = await this.notificationService.createNotification(
      body.message,
      body.userName,
    );
    return { message: 'Notification created successfully', data: notification };
  }

  // Endpoint to get notifications for a specific user
  @Get(':userName')
  async getNotifications(@Param('userName') userName: string) {
    // Fetch all notifications for the user
    const notifications = await this.notificationService.getNotifications(userName);
    return { message: 'Notifications retrieved successfully', data: notifications };
  }

  // Endpoint to mark a notification as read
  @Patch(':notificationId/read')
  async markAsRead(@Param('notificationId') notificationId: string) {
    // Mark the notification as read
    const updatedNotification = await this.notificationService.markAsRead(notificationId);
    return { message: 'Notification marked as read', data: updatedNotification };
  }

  // Endpoint to delete a notification (optional)
  @Patch(':notificationId/delete')
  async deleteNotification(@Param('notificationId') notificationId: string) {
    // Delete the notification
    const deletedNotification = await this.notificationService.deleteNotification(notificationId);
    return { message: 'Notification deleted successfully', data: deletedNotification };
  }
}
