import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification, NotificationSchema } from './notification.schema';
import { Users, UsersSchema } from 'src/users/users.schema';
import { Courses, CoursesSchema } from 'src/courses/courses.schema';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    forwardRef(() => CoursesModule), 
    forwardRef(() => UsersModule),   
  ],
  providers: [NotificationService,CoursesService,UsersService],
  controllers: [NotificationController],
  exports:[NotificationService,CoursesService,UsersService]
})
export class NotificationModule {}
