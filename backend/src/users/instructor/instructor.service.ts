import { Injectable, NotFoundException, Inject, forwardRef ,InternalServerErrorException,BadRequestException, UseGuards} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { courseDocument } from 'src/courses/courses.schema';
import { Courses} from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { Users } from '../users.schema';
import { UsersSchema } from '../users.schema';
import { UsersService } from '../users.service';
import { Module } from 'src/modules/modules.schema';
import {moduleDocument } from 'src/modules/modules.schema';
import { ProgressService } from 'src/progress/progress.service';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Injectable()
@UseGuards(AuthGuard)
export class InstructorService {
    constructor(
        @InjectModel(Users.name) private readonly userModel: Model<Users>, //msh motakeda
        @InjectModel(Courses.name) private readonly courseModel: Model<Courses>,
        @InjectModel(Module.name) private readonly moduleModel: Model<moduleDocument>,
        @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService,
    ){}
 

    //GET AVERAGE RATING
  @Public()
async getAvgRating( ObjectId: mongoose.Types.ObjectId): Promise<number> {
    const instructor = await this.userModel.findById(ObjectId);
    return instructor.averageRating;
   }
   
@UseGuards(AuthorizationGuard)
@Roles(Role.User)
   //SET RATING,TOTAL,AVERAGE
   async setRating(ObjectId: mongoose.Types.ObjectId,score:number): Promise<void> {
     const instructor = await this.userModel.findById(ObjectId);
     instructor.totalRating = instructor.totalRating + score;
     instructor.totalStudents += 1;
     instructor.averageRating = instructor.totalRating/instructor.totalStudents;
   }

   @UseGuards(AuthorizationGuard)
   @Roles(Role.Instructor, Role.Admin)
   async deleteInstructor(username: string): Promise<{ message: string }> {
    // Fetch the instructor by username
    const instructor = await this.userModel.findOne({ username, role: 'instructor' }).exec();
    if (!instructor) {
      throw new NotFoundException(`Instructor with username ${username} not found`);
    }
  
    // Ensure the instructor has courses
    if (!instructor.courses || instructor.courses.length === 0) {
      throw new BadRequestException(`Instructor with username ${username} has no courses to validate`);
    }
  
    // Check all courses in the instructor's array
    for (const courseId of instructor.courses) {
      const course=await this.coursesService.getcoursebyid(courseId);
      const progressRecords = await this.progressService.findAllByCourse(course.course_code);
  
      // Validate if all students have completed the course
      const allCompleted = progressRecords.every(record => record.completion_percentage === 100);
      if (!allCompleted) {
        throw new BadRequestException(
          `Cannot delete instructor. Students are still in progress for course with ID: ${courseId}`
        );
      }
      await this.coursesService.deleteCourse(course.course_code);
    }
  
    // All validations passed, delete the instructor
    await this.userModel.deleteOne({ username }).exec();
  
    return { message: `Instructor with username ${username} deleted successfully` };
  }
  
}
