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
async createForumNotification( @Req() user,@Param('course_code')course_code:string, @Body('dto')dto:CreateNotificationDto): Promise<notificationDocument>{
    return this.notificationService.createForumNotification(user,course_code,dto);
}

//create notification for chat inform receiver
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.User)
@Post('private-chatsent/:recieverUsername')
async createPrivateChatNotification(@Req() user, @Param('recieverUsername')recieverUsername:string): Promise<notificationDocument>{
    return this.notificationService.createPrivateChatNotification(user,recieverUsername);
}

//create notification for chat inform everyone taking course with this course_code public chat is created
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.User, Role.Instructor)
@Post('chatcreated/:course_code')
async createPublicChatNotification(@Req() user, @Param('course_code') course_code:string): Promise<notificationDocument>{
    return this.notificationService.createPublicChatNotification(user,course_code);
}


//create notification for chat inform members of this chat message is sent
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.User, Role.Instructor) 
@Post('public-chatsent/:chatId')
async sendPublicChatNotification(@Req() user, @Param('chatId') chatId:string): Promise<notificationDocument>{
    return this.notificationService.sendPublicChatNotification(user, chatId );
}





}
