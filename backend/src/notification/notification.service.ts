import { Injectable,Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import{Notification, notificationDocument} from './notification.schema';
import mongoose, { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.schema';

@Injectable()
export class NotificationService {
    constructor (
        @InjectModel(Notification.name) private notificationModel: Model<notificationDocument>,
        @InjectModel(Users.name) private readonly userModel: Model<Users>,
        @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    ){}

 //GET: 
 async getNotification(user:any): Promise<notificationDocument[]> {
    console.log("username IS X2:");
    console.log(user.username);
    const User= await this.userModel.findOne({username: user.username});
    if (!User) {
        throw new NotFoundException(`User with username ${user} not found`);
      }
    
      const notificationIds = User.notification;
      console.log("number of notification");
      console.log(notificationIds.length);
      if (!notificationIds || notificationIds.length === 0) {
        console.log('No notifications');
        return;
      }
    
      const notifications = await this.notificationModel.find({ _id: { $in: notificationIds }, isRead: false }).exec();
      if (!notifications || notifications.length === 0) {
        console.log('No notifications found for the user.');
        return;
      }
    
      // Update each notification's `isRead` attribute to `true`
      await this.notificationModel.updateMany({ _id: { $in: notificationIds } },{ $set: { isRead: true } },);
    
    return notifications;
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
async createForumNotification(user:any,course_code:string,dto:CreateNotificationDto): Promise<notificationDocument>{
    const notification= await this.notificationModel.create(dto) as notificationDocument ;

    const course= await this.coursesService.findOne(course_code);
    const enrolledUsernames = await this.usersService.getEnrolledStudents(course._id); //i have usernames 
    for (const username of enrolledUsernames) {
        await this.userModel.updateOne({ username },{ $push: { notification: notification._id}}); //add notifcation id to array of notifcation in user
      }

      //need to check if sender is student send notification to the instructor
     const sender= this.usersService.findUserByUsername(user);
     if((await sender).role ==="student"){
       const instructor = await this.usersService.findUserByUsername(course.created_by);
       if(instructor){
         await this.userModel.updateOne({ username: instructor.username },{ $push: { notification: notification._id}}); //add notifcation id to array of notifcation in user
       }
     }
      return notification;
}

//create notification for chat one to one
async createChatNotification(user,recieverUsername:string): Promise<notificationDocument>{
    const title = `${user} sent you a private message `;
    const NotificationDto = {
        message: title
      };
       const notification= await this.notificationModel.create(NotificationDto) as notificationDocument ;
       await this.userModel.updateOne({ username: recieverUsername},{ $push: { notification: notification._id}}); //add notifcation id to array of notifcation in user
       return notification;
}

}
