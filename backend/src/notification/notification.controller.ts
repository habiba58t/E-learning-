import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException, InternalServerErrorException,UseGuards,Req} from '@nestjs/common';
import {NotificationService} from './notification.service';
import { notificationDocument } from './notification.schema';
import * as mongoose from 'mongoose';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('notification')
export class NotificationController {
     
    constructor(private readonly notificationService: NotificationService) {}
   
 //get notification  
 @UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Admin, Role.Instructor, Role.User) 
@Get('usernotifications/:username')
  async getNotification(@Param('username')username: string): Promise<notificationDocument[]> {
    return this.notificationService.getNotification(username);
  }

//mark notification as read 
  @Get('mark-as-read/:username')
  async markNotificationsAsRead(@Param('username') username: string): Promise<string> {
    try {
      await this.notificationService.markNotificationsAsRead(username);
      return `All notifications for ${username} have been marked as read.`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

//create notification for module
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Post('moduleadded/:coursecode')
async createModuleNotification(@Param('course_code') course_code: string, @Body('dto')dto:CreateNotificationDto): Promise<notificationDocument>{
    return this.notificationService.createModuleNotification(course_code,dto);
}

//create notification for forum and reply
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.User, Role.Instructor)
@Post('forum/:coursecode')
async createForumNotification( @Param('username') username,@Param('course_code')course_code:string, @Body('dto')dto:CreateNotificationDto): Promise<notificationDocument>{
    return this.notificationService.createForumNotification(username ,course_code);
}

@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.User, Role.Instructor)
@Post('forum/:coursecode')
async replytoForumNotification(@Param('threadtitle') threadtitle:string, @Param('username') username,@Param('course_code')course_code:string, @Body('dto')dto:CreateNotificationDto): Promise<notificationDocument>{
    return this.notificationService.replytoForumNotification(threadtitle,username ,course_code);
}

//create notification for chat inform receiver
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.User)
@Post('private-chatsent/:recieverUsername')
async createPrivateChatNotification(@Param('username') username, @Param('recieverUsername')recieverUsername:string): Promise<notificationDocument>{
    return this.notificationService.createPrivateChatNotification(username ,recieverUsername);
}

//create notification for chat inform everyone taking course with this course_code public chat is created
//username is person who created the chat
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.User, Role.Instructor)
@Post('chatcreated/:course_code/:username')
async createPublicChatNotification(@Param('username') username: string, @Param('course_code') course_code:string): Promise<void>{
    return this.notificationService.createPublicChatNotification(username,course_code);
}


//create notification for chat inform members of this chat message is sent
//username is sender of the message
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.User, Role.Instructor) 
@Post('public-chatsent/:chatId')
async sendPublicChatNotification( @Param('chatId') chatId:string): Promise<void>{
    return this.notificationService.sendPublicChatNotification( chatId );
}





}
