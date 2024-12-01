import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';
import { Model } from 'mongoose';
import { Courses} from 'src/courses/courses.schema';
import * as mongoose from 'mongoose';
import { CoursesService } from 'src/courses/courses.service';
import { userDocument } from './users.schema';
import { courseDocument } from 'src/courses/courses.schema';
import { ProgressService } from 'src/progress/progress.service';
@Injectable()
export class UsersService {
    constructor(
        // @InjectModel(Module.name) private moduleModel: Model<Module>,
         @InjectModel(Users.name) private readonly userModel: Model<userDocument>,
         @InjectModel(Courses.name) private readonly courseModel: Model<courseDocument>,
         @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
         @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService){}


    //GET: get array of courses for a speicifc user
    // async findCoursesArray(username: string): Promise<Courses[]> {
    //     const found= await this.userModel.findOne({username });
    //     if (!found) {
    //         throw new NotFoundException(`User with username ${username} not found`);
    //       }
    //     return found.courses;
    // }

//GET USER BY username
async findUserByUsername( username: string): Promise<Users> {
  return await this.userModel.findOne({username});
}

// //GET ENROLLED STUDENTS
// async getEnrolledStudents(objectId:mongoose.Types.ObjectId): Promise<Users[]>{
// const course= await this.coursesService.findById(objectId);
// return await this.progressService.getStudentsEnrolled(course.course_code);
// }

}
