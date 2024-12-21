import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../users.schema';
import { UsersService } from '../users.service';
import { Courses, CoursesSchema } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }])],
  controllers: [AdminController],
  providers: [AdminService,UsersService,CoursesService  ],
  exports: [UsersService,CoursesService,AdminService]
})
export class AdminModule {}