import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, notificationDocument } from './notification.schema';
import mongoose, { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.schema';
import { ProgressService } from 'src/progress/progress.service';
import { GroupChatService } from 'src/group-chat/group-chat.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<notificationDocument>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService,
    @Inject(forwardRef(() => GroupChatService)) private readonly groupService: GroupChatService,
  ) {}

  // GET:
  async getNotification(username: string): Promise<notificationDocument[]> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const notificationIds = user.notification;
    if (!notificationIds || notificationIds.length === 0) {
      console.log('No notifications');
      return [];
    }

    const notificationObjectIds = notificationIds.map(id => new mongoose.Types.ObjectId(id));
    const notifications = await this.notificationModel.find({
      _id: { $in: notificationObjectIds },
      isRead: false,
    }).exec();

    if (!notifications || notifications.length === 0) {
      console.log('No unread notifications found for the user.');
      return [];
    }

    return notifications;
  }

  async markNotificationsAsRead(username: string): Promise<void> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const notificationIds = user.notification;
    if (!notificationIds || notificationIds.length === 0) {
      console.log('No notifications to mark as read.');
      return;
    }

    await this.notificationModel.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { isRead: true } },
    );

    console.log(`All notifications marked as read for ${username}`);
  }

  // create notification for module
  async createModuleNotification(course_code: string, dto: CreateNotificationDto): Promise<notificationDocument> {
    const notification2 = await this.notificationModel.create(dto) as notificationDocument;
    const course = await this.coursesService.findOne(course_code);
    const enrolledUsernames = await this.usersService.getEnrolledStudents(course._id); // i have usernames 
    for (const username of enrolledUsernames) {
      const notification = await this.notificationModel.create(dto) as notificationDocument;
      await this.userModel.updateOne({ username }, { $push: { notification: notification._id } }); // add notification id to array of notification in user
    }
    return notification2;
  }

  async createForumNotification(username: string, course_code: string): Promise<notificationDocument> {
    const title = `${username} created new forum in ${course_code}`;
    const course = await this.coursesService.findOne(course_code); // Get course by course code
    const enrolledUsernames = await this.usersService.getEnrolledStudents(course._id);

    // Notify enrolled students
    for (const username1 of enrolledUsernames) {
      try {
        if (username1 === username) {
          console.log(`Skipping notification for user who created the forum: ${username1}`);
          continue; // Skip this iteration
        }

        const user = await this.usersService.findUserByUsername(username1);
        if (!user) {
          console.warn(`User not found: ${username1}`);
          continue; // Skip if user doesn't exist
        }

        const NotificationDto = {
          message: title,
        };

        const notification = await this.notificationModel.create(NotificationDto) as notificationDocument;

        // Push the notification ID into the user's notification array
        user.notification.push(notification._id);
        await user.save();
        console.log(`Notification added to user: ${username1}`);
      } catch (err) {
        console.error(`Failed to add notification for user: ${username1}, ${err}`);
      }
    }

    // Notify instructor if sender is a student
    const sender = await this.usersService.findUserByUsername(username);
    if (sender.role === 'student') {
      const instructor = await this.usersService.findUserByUsername(course.created_by);
      if (instructor) {
        if (instructor.username !== username) { // Avoid notifying the creator
          const NotificationDto = {
            message: title,
          };

          const notification = await this.notificationModel.create(NotificationDto) as notificationDocument;

          instructor.notification.push(notification._id);
          await instructor.save();
          console.log(`Notification added to instructor: ${instructor.username}`);
        } else {
          console.log(`Skipping notification for instructor who created the forum: ${username}`);
        }
      }
    }

    const finalNotificationDto = {
      message: title,
    };

    return await this.notificationModel.create(finalNotificationDto) as notificationDocument;
  }

  async replytoForumNotification(threadtitle: string, username: string, course_code: string): Promise<notificationDocument> {
    const title = `${username} replyed to ${threadtitle} to forum in ${course_code}`;

    const course = await this.coursesService.findOne(course_code); // get course by course code
    const enrolledUsernames = await this.progressService.findAllStudents(course_code); // i have usernames 
    for (const username1 of enrolledUsernames) {
      try {
        if (username1 === username) {
          console.log(`Skipping notification for user who created the chat: ${username}`);
          continue; // Skip this iteration
        }

        const user = await this.usersService.findUserByUsername(username1);
        if (!user) {
          console.warn(`User not found: ${username1}`);
          continue; // Skip if user doesn't exist
        }

        const NotificationDto = {
          message: title,
        };
        const notification = await this.notificationModel.create(NotificationDto) as notificationDocument;

        // Push the notification ID into the user's notification array
        user.notification.push(notification._id);
        await user.save(); // Save the updated user document
        console.log(`Notification added to user: ${username1}`);
      } catch (err) {
        console.error(`Failed to add notification for user: ${username1}, ${err}`);
      }
    }

    const NotificationDto = {
      message: title,
    };
    const notification = await this.notificationModel.create(NotificationDto) as notificationDocument;

    // need to check if sender is student send notification to the instructor
    const sender = this.usersService.findUserByUsername(username);
    if ((await sender).role === 'student') {
      const instructor = await this.usersService.findUserByUsername(course.created_by);
      if (instructor) {
        if (instructor.username !== username) {
          console.log(`Skipping notification for user who created the chat: ${username}`);
          instructor.notification.push(notification._id);
          await instructor.save();
          console.log(instructor.username);
        }
      }
    }

    return notification;
  }

  // create notification for chat one to one
  async createPrivateChatNotification(username, recieverUsername: string): Promise<notificationDocument> {
    const title = `${username} sent you a private message`;
    const NotificationDto = {
      message: title,
    };
    const notification = await this.notificationModel.create(NotificationDto) as notificationDocument;
    await this.userModel.updateOne({ username: recieverUsername }, { $push: { notification: notification._id } }); // add notification id to array of notification in user
    return notification;
  }

  async createPublicChatNotification(username: string, course_code: string): Promise<void> {
    try {
      const course = await this.coursesService.findOne(course_code); // Get course by course code
      if (!course) {
        console.error(`Course not found for code: ${course_code}`);
        return;
      }

      const users = await this.progressService.findAllStudents(course_code); // Get all students enrolled in the course
      if (!users || users.length === 0) {
        console.warn(`No students found for course: ${course_code}`);
        return;
      }

      for (const studentUsername of users) {
        try {
          // Skip the user who created the group chat
          if (studentUsername === username) {
            console.log(`Skipping notification for user who created the chat: ${username}`);
            continue;
          }

          // Fetch the user document by username
          const user = await this.usersService.findUserByUsername(studentUsername);
          if (!user) {
            console.warn(`User not found: ${studentUsername}`);
            continue;
          }

          const message = `${username} created a group chat in ${course.title} course`; // Message with who created the group chat
          const NotificationDto = {
            message,
            created_by: username,
          };

          const notification = await this.notificationModel.create(NotificationDto) as notificationDocument;

          // Push the notification ID into the user's notification array
          user.notification.push(notification._id);
          await user.save(); // Save the updated user document
          console.log(`Notification added to user: ${studentUsername}`);
        } catch (err) {
          console.error(`Failed to add notification for user: ${studentUsername}, ${err}`);
        }
      }
    } catch (err) {
      console.error(`Error in createPublicChatNotification: ${err.message}`, err);
    }
  }

  // create notification for chat one to one send message to all members in this chat
  async sendPublicChatNotification(chatId: string, username: string): Promise<void> {
    // Get chat by its ID
    const chat = await this.groupService.getGroupById(chatId);
    const users = chat.members; // Get members of this chat
    console.log(users);

    for (const username1 of users) {
      try {
        // Fetch the user document by username
        if (username1 === username) {
          console.log(`Skipping notification for user who created the chat: ${username1}`);
          continue; // Skip this iteration
        }
        const user = await this.usersService.findUserByUsername(username1);
        if (!user) {
          console.warn(`User not found: ${username1}`);
          continue; // Skip if user doesn't exist
        }

        // Create a notification specifically for this user
        const message = `New message sent in group chat ${chatId}`;
        const NotificationDto = {
          message,
          // created_by: "system" // or any identifier for the notification creator
        };

        const notification = await this.notificationModel.create(NotificationDto) as notificationDocument;

        // Push the notification ID into the user's notification array
        user.notification.push(notification._id);
        await user.save(); // Save the updated user document
        console.log(`Notification added to user: ${username1}`);
      } catch (err) {
        console.error(`Failed to add notification for user: ${username1}`, err);
      }
    }
  }
}
