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
 async getNotification(objectId:mongoose.Types.ObjectId): Promise<notificationDocument> {
    const notification= await this.notificationModel.findById(objectId);
    notification.isRead=true;
    return notification;
 }   

 //create notification for module
async createModuleNotification(course_code: string,dto:CreateNotificationDto): Promise<notificationDocument>{
    const notification= await this.notificationModel.create(dto) as notificationDocument ;
    const course= await this.coursesService.findOne(course_code);
    console.log(course);
    const enrolledUsernames = await this.usersService.getEnrolledStudents(course._id); //i have usernames 
    console.log(enrolledUsernames); //this is 0
    for (const username of enrolledUsernames) {
        await this.userModel.updateOne({ username },{ $push: { notification: notification._id}}); //add notifcation id to array of notifcation in user
    
      }
      return notification;
}


}
