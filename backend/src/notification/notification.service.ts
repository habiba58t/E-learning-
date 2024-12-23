import { Injectable,Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import{Notification, notificationDocument} from './notification.schema';
import mongoose, { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.schema';
import { ProgressService } from 'src/progress/progress.service';
import { GroupChatService } from 'src/group-chat/group-chat.service';

@Injectable()
export class NotificationService {
    constructor (
        @InjectModel(Notification.name) private notificationModel: Model<notificationDocument>,
        @InjectModel(Users.name) private readonly userModel: Model<Users>,
        @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService,
        @Inject(forwardRef(() => GroupChatService)) private readonly groupService: GroupChatService,

    ){}

 //GET: 
//  async getNotification(username:string): Promise<notificationDocument[]> {

    
//     const User= await this.userModel.findOne({username});
//     if (!User) {
//         throw new NotFoundException(`User with username ${username} not found`);
//       }
    
//       const notificationIds = User.notification;
//       console.log("Notification IDs:", notificationIds);
//       console.log("number of notification");
//       console.log(notificationIds.length);
//       if (!notificationIds || notificationIds.length === 0) {
//         console.log('No notifications');
//         return;
//       }
    
      
//       //const notifications = await this.notificationModel.find({ _id: { $in: notificationIds }, isRead: false }).exec();
      
//       const notificationObjectIds = notificationIds.map(id => new mongoose.Types.ObjectId(id));
//       console.log("Notification Query:", {
//         _id: { $in: notificationObjectIds },
//         isRead: false,
//       });
// const notifications = await this.notificationModel.find({ _id: { $in: notificationObjectIds }, isRead: false }).exec();
//       if (!notifications || notifications.length === 0) {
//         console.log('No notifications found for the user.');
//         return;
//       }
    
//       // Update each notification's `isRead` attribute to `true`
//       await this.notificationModel.updateMany({ _id: { $in: notificationIds } },{ $set: { isRead: true } },);
    
//     return notifications;
//  }   


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
      isRead: false 
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
      { $set: { isRead: true } }
  );

  console.log('All notifications marked as read for', username);
}



















 //create notification for module
async createModuleNotification(course_code: string,dto:CreateNotificationDto): Promise<notificationDocument>{
    const notification= await this.notificationModel.create(dto) as notificationDocument ;
    const course= await this.coursesService.findOne(course_code);
    const enrolledUsernames = await this.usersService.getEnrolledStudents(course._id); //i have usernames 
    for (const username of enrolledUsernames) {
        await this.userModel.updateOne({ username },{ $push: { notification: notification._id}}); //add notifcation id to array of notifcation in user
    
      }
      return notification;
}

//create notification for forum and reply
async createForumNotification(username:string ,course_code:string): Promise<notificationDocument>{
  const title = `${username} created new forum in ${course_code} `;
  const NotificationDto = {
    message: title
  };
    const notification= await this.notificationModel.create(NotificationDto) as notificationDocument ;

    const course = await this.coursesService.findOne(course_code) //get course by course code
   // const enrolledUsernames =await this.progressService.findAllStudents(course_code); //i have usernames 
   const enrolledUsernames = await this.usersService.getEnrolledStudents(course._id);
    for (const username of enrolledUsernames) {
      try {
        // Fetch the user document by username
        const user = await this.usersService.findUserByUsername(username);
        if (!user) {
          console.warn(`User not found: ${username}`);
          continue; // Skip if user doesn't exist
        }
  
        // Push the notification ID into the user's notification array
        console.log(user.username)
        user.notification.push(notification._id);
        await user.save(); // Save the updated user document
        console.log(`Notification added to user: ${username}`);
      } catch (err) {
        console.error(`Failed to add notification for user: ${username}`, err);
      }
    }
      //need to check if sender is student send notification to the instructor
     const sender= this.usersService.findUserByUsername(username);
     if((await sender).role ==="student"){
       const instructor = await this.usersService.findUserByUsername(course.created_by);
       console.log(instructor.username)
       if(instructor){
         //await this.userModel.updateOne({ username: instructor.username },{ $push: { notification: notification._id}}); //add notifcation id to array of notifcation in user
         instructor.notification.push(notification._id);
         await instructor.save();
         console.log(instructor.username)
        }
     }
      return notification;
}






async replytoForumNotification(threadtitle:string,username:string ,course_code:string): Promise<notificationDocument>{
  const title = `${username} replyed to ${threadtitle} to forum in ${course_code} `;
  const NotificationDto = {
    message: title
  };
    const notification= await this.notificationModel.create(NotificationDto) as notificationDocument ;

    const course = await this.coursesService.findOne(course_code) //get course by course code
    const enrolledUsernames =await this.progressService.findAllStudents(course_code); //i have usernames 
    for (const username of enrolledUsernames) {
      try {
        // Fetch the user document by username
        const user = await this.usersService.findUserByUsername(username);
        if (!user) {
          console.warn(`User not found: ${username}`);
          continue; // Skip if user doesn't exist
        }
  
        // Push the notification ID into the user's notification array
        user.notification.push(notification._id);
        await user.save(); // Save the updated user document
        console.log(`Notification added to user: ${username}`);
      } catch (err) {
        console.error(`Failed to add notification for user: ${username}`, err);
      }
    }
      //need to check if sender is student send notification to the instructor
     const sender= this.usersService.findUserByUsername(username);
     if((await sender).role ==="student"){
       const instructor = await this.usersService.findUserByUsername(course.created_by);
       if(instructor){
         //await this.userModel.updateOne({ username: instructor.username },{ $push: { notification: notification._id}}); //add notifcation id to array of notifcation in user
         instructor.notification.push(notification._id);
        }
     }
      return notification;
}















//create notification for chat one to one
async createPrivateChatNotification(username ,recieverUsername:string): Promise<notificationDocument>{
    const title = `${username} sent you a private message `;
    const NotificationDto = {
        message: title
      };
       const notification= await this.notificationModel.create(NotificationDto) as notificationDocument ;
       await this.userModel.updateOne({ username: recieverUsername},{ $push: { notification: notification._id}}); //add notifcation id to array of notifcation in user
       return notification;
}


//create notification for public chat
async createPublicChatNotification(username: string,course_code:string): Promise<void>{
    const course = await this.coursesService.findOne(course_code) //get course by course code
    const users =await this.progressService.findAllStudents(course_code); //get all students enrolled in that course by its id
   
    const message = `${username} created a group chat in ${course.title} course`; //message with who created the group chat
    const NotificationDto = {
      message,
      created_by: username
    };
    const notification= await this.notificationModel.create(NotificationDto) as notificationDocument ; //create the notification
    for (const username of users) {
      try {
        // Fetch the user document by username
        const user = await this.usersService.findUserByUsername(username);
        if (!user) {
          console.warn(`User not found: ${username}`);
          continue; // Skip if user doesn't exist
        }
  
        // Push the notification ID into the user's notification array
        user.notification.push(notification._id);
        await user.save(); // Save the updated user document
        console.log(`Notification added to user: ${username}`);
      } catch (err) {
        console.error(`Failed to add notification for user: ${username}`, err);
      }
    }

}


//create notification for chat one to one send message to all members in this chat
async sendPublicChatNotification( chatId: string): Promise<void>{
  //const cid=new mongoose.Types.ObjectId(chatId)
  const chat = await this.groupService.getGroupById(chatId) //get chat by its id
  const users =chat.members; //get members of this chat
  console.log(users)
 
  const message = `new message sent to ${chatId} `; //message with who created the group chat
  const NotificationDto = {
    message,
  
  };
  console.log(message)
  const notification= await this.notificationModel.create(NotificationDto) as notificationDocument ; //create the notification
  
  for (const username of users) {
    try {
      // Fetch the user document by username
      const user = await this.usersService.findUserByUsername(username);
      if (!user) {
        console.warn(`User not found: ${username}`);
        continue; // Skip if user doesn't exist
      }

      // Push the notification ID into the user's notification array
      user.notification.push(notification._id);
      await user.save(); // Save the updated user document
      console.log(`Notification added to user: ${username}`);
    } catch (err) {
      console.error(`Failed to add notification for user: ${username}`, err);
    }
  }
}
}
