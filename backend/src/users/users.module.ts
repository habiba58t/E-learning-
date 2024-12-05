import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { InstructorModule } from './instructor/instructor.module';
import { StudentModule } from './student/student.module';
import { UsersSchema } from './users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { AdminModule } from './admin/admin.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    AdminModule,CoursesModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports:[UsersService],
})
export class UsersModule {}
