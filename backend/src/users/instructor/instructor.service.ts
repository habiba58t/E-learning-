import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
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

@Injectable()
export class InstructorService {
    constructor(
        @InjectModel(Users.name) private readonly userModel: Model<Users>, //msh motakeda
        @InjectModel(Courses.name) private readonly courseModel: Model<Courses>,
        @InjectModel(Module.name) private readonly moduleModel: Model<moduleDocument>,
        @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    ){}




     //GET: all courses student enrolled in and not outdated           DONE EXCEPT USERNAME NEED TO GET FROM TOKEN
  //     async getCoursesForStudent(): Promise<Courses[]> {
        // Step 1: Get the courses array for the user
     //     const coursesArray = await this.usersService.findCoursesArray(this.userModel.username);
      
        // Step 2: Fetch all courses by their ObjectIds
     //     const courses = await this.courseModel.find({
   //         _id: { $in: coursesArray }, // Match ObjectIds from coursesArray
     //     }).exec();
      
      
   //     return courses;
    //  }

//mehtaga agyb modules of a course
    async getModulesForStudent(): Promise<moduleDocument[]> {
        return 
    }
    //GET AVERAGE RATING
async getTotalRating( ObjectId: mongoose.Types.ObjectId): Promise<number> {
    const instructor = await this.userModel.findById(ObjectId);
    return instructor.totalRating;
   }
   
   //SET RATING,TOTAL,AVERAGE
   async setRating(ObjectId: mongoose.Types.ObjectId,score:number): Promise<void> {
     const instructor = await this.userModel.findById(ObjectId);
     instructor.totalRating = instructor.totalRating + score;
     instructor.totalStudents += 1;
     instructor.averageRating = instructor.totalRating/instructor.totalStudents;
   }
}
