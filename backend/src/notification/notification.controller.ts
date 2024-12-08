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
@Get(':ObjectId')
  async getNotification(@Param("ObjectId")ObjectId:string): Promise<notificationDocument> {
    const objectId = new mongoose.Types.ObjectId(ObjectId);
    return this.notificationService.getNotification(objectId);
  }

//create notification for module
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Post('moduleadded/:title/coursecode')
async createModuleNotification(@Param('course_code') course_code: string, @Body('dto')dto:CreateNotificationDto): Promise<notificationDocument>{
    return this.notificationService.createModuleNotification(course_code,dto);
}
  
}
