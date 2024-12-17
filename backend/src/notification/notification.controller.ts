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
@Get('usernotifications')
  async getNotification(@Req() {user}): Promise<notificationDocument[]> {
    console.log("user is:",user);
    return this.notificationService.getNotification(user);
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
    return this.notificationService.createForumNotification(username ,course_code,dto);
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
// @UseGuards(AuthGuard, AuthorizationGuard)
// @Roles(Role.Admin, Role.User, Role.Instructor) 
// @Post('public-chatsent/:chatId/:username')
// async sendPublicChatNotification(@Param('username') username: string, @Param('chatId') chatId:string): Promise<void>{
//     return this.notificationService.sendPublicChatNotification(username, chatId );
// }





}
