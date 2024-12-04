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
import { SearchUserDto } from './dto/SearchUser.dto';
import { CreateUserDto } from './dto/CreateUser.dto';
@Injectable()
export class UsersService {
    constructor(
        // @InjectModel(Module.name) private moduleModel: Model<Module>,
         @InjectModel(Users.name) private readonly userModel: Model<userDocument>,
         @InjectModel(Courses.name) private readonly courseModel: Model<courseDocument>,
         @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
         @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService){}

//ADD create user for all users that takes create dto

    //GET: get array of courses for a speicifc user
    // async findCoursesArray(username: string): Promise<Courses[]> {
    //     const found= await this.userModel.findOne({username });
    //     if (!found) {
    //         throw new NotFoundException(`User with username ${username} not found`);
    //       }
    //     return found.courses;
    // }

//GET USER BY username
async findUserByUsername( username: string): Promise<userDocument> {
  return await this.userModel.findOne({username});
}

// //GET ENROLLED STUDENTS
// async getEnrolledStudents(objectId:mongoose.Types.ObjectId): Promise<Users[]>{
// const course= await this.coursesService.findById(objectId);
// return await this.progressService.getStudentsEnrolled(course.course_code);
// }


// CREATE NEW STUDENT FOR REGISTER
async create(createUserDto: CreateUserDto, password_hash: string): Promise<userDocument> {
  const newUser = new this.userModel({
    ...createUserDto, // Spread properties from CreateUserDto
    password_hash, // Add the hashed password
    created_at: new Date(), // Set creation timestamp
    courses: [], // Initialize courses as an empty array
    notes: new Map(), // Initialize notes as an empty Map
    studentScore: new Map(), // Initialize studentScore as an empty Map
    studentLevel: new Map(), // Initialize studentLevel as an empty Map
  });

  // Save the new user to the database
  return await newUser.save();
}



async findOneByEmail(email: string): Promise<userDocument>{
  return await this.userModel.findOne({email});
}


async searchUsers(loggedInUserId: string | null, searchUserDto: SearchUserDto): Promise<userDocument[]> {
  const query: any = {};

  // If the user is logged in (loggedInUserId exists), allow them to search both students and instructors
  if (loggedInUserId) {
    // If role filter is provided, use it
    if (searchUserDto.role) {
      query['role'] = searchUserDto.role;
    }

    // If name filter is provided, apply it to the query
    if (searchUserDto.name) {
      query['name'] = { $regex: searchUserDto.name, $options: 'i' }; // Case-insensitive search
    }

    // Allow filtering for both students and instructors
    if (searchUserDto.role && searchUserDto.role === 'student') {
      query['role'] = 'student';
    } else if (searchUserDto.role && searchUserDto.role === 'instructor') {
      query['role'] = 'instructor';
    }

  } else {
    // If the user is not logged in, restrict the search to instructors only
    if (searchUserDto.role && searchUserDto.role !== 'instructor') {
      throw new Error('You are not logged in to search for students.');
    }
    
    // Only allow instructors to be returned if not logged in
    query['role'] = 'instructor';
  }

  return this.userModel.find(query).exec();
}
}

