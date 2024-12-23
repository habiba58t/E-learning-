import { Injectable, NotFoundException, Inject, forwardRef,UseGuards } from '@nestjs/common';
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
import { CreateUserDto } from './dto/createuser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';


@Injectable()
export class UsersService {
    constructor(
        // @InjectModel(Module.name) private moduleModel: Model<Module>,
         @InjectModel(Users.name) private readonly userModel: Model<userDocument>,
         @InjectModel(Courses.name) private readonly courseModel: Model<courseDocument>,
         @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
         @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService){}

//ADD create user for all users that takes create dto

//GET USER BY username
async findUserByUsername( username: string): Promise<userDocument> {
  return await this.userModel.findOne({username});
}

// //GET ENROLLED STUDENTS in a specific course 
async getEnrolledStudents(objectId:mongoose.Types.ObjectId): Promise<string[]>{  // i have course objectid 
const course= await this.coursesService.getcoursebyid(objectId);
console.log(`course seeing who is enroll in ${course}`)
return await this.progressService.findAllStudentsEnrolled(course.course_code);
}//get all username where they didn't finish course




  
// CREATE NEW User FOR REGISTER

async create(createUserDto: CreateUserDto): Promise<userDocument> {
  // Hash the password before saving
 // const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  const newUser = new this.userModel({
      ...createUserDto,  // Spread the properties from CreateUserDto
      password_hash: createUserDto.passwordHash,  // Save the hashed password in password_hash field
      created_at: new Date(),  // Set creation timestamp
      courses: [],  // Initialize courses as an empty array
      notes: new Map(),  // Initialize notes as an empty Map
      studentScore: new Map(),  // Initialize studentScore as an empty Map
      studentLevel: new Map(),  // Initialize studentLevel as an empty Map
  });

  // Save the new user to the database
  return await newUser.save();
}

//GET: search for intstructor
async searchUsers(
  loggedInUserId: string | null, 
  searchUserDto: SearchUserDto
): Promise<userDocument[]> {
  console.log('SearchUsers method called'); // Debugging line
  const query: any = {};

  // If the user is logged in, allow flexible searches
  if (loggedInUserId) {
    if (searchUserDto.role) {
      query['role'] = searchUserDto.role; // Filter by role
    }
    if (searchUserDto.name) {
      query['name'] = { $regex: searchUserDto.name, $options: 'i' }; // Filter by name
    }
  } else {
    // For unauthenticated users, restrict to instructors only
    query['role'] = 'instructor';
    if (searchUserDto.name) {
      query['name'] = { $regex: searchUserDto.name, $options: 'i' }; // Name filter for public searches
    }
  }

  console.log('MongoDB query:', query); // Log the constructed query
  return this.userModel.find(query).exec(); // Execute the query in MongoDB
}






//for admin (Hagar)
async findUsers(username?: string, role?: Role): Promise<Users[]> {
  const query: any = {};
  if (username) {
      query.username = { $regex: new RegExp(username, 'i') }; 
  }
  if (role) {
      query.role = role;
  }
  return this.userModel.find(query).exec();
}

//UPDATE STUDENT PROFILE
@UseGuards(AuthorizationGuard)
@Roles(Role.User, Role.Admin, Role.Instructor)
async updateProfile(username: string, updateUserDto: UpdateUserDto): Promise<userDocument> {
  // Find the student by username
  const user = await this.userModel.findOne({ username }).exec();
  if (!user) {
    throw new NotFoundException(`user with username "${username}" not found.`);
  }

  // Update the student profile
  Object.assign(user, updateUserDto);

  // Save the updated student
  await user.save();

  return user;
}


async deleteUser(username: string):Promise<userDocument>{
  return await this.userModel.findOneAndDelete({username});
}


async validation(username: string): Promise<boolean> {
  const user = await this.userModel.findOne({ username }).exec();
  return !!user;
}
  async getTotalNumberOfUsers():Promise<number>{
        return this.userModel.countDocuments();
      }

      
//SET RATING,TOTAL,AVERAGE
   async setRating(ObjectId: mongoose.Types.ObjectId,score:number): Promise<void> {
     const instructor = await this.userModel.findById(ObjectId);
     instructor.totalRating = instructor.totalRating + score;
     instructor.totalStudents += 1;
     instructor.averageRating = instructor.totalRating/instructor.totalStudents;
   }

   async getAvgRating( ObjectId: mongoose.Types.ObjectId): Promise<number> {
       const instructor = await this.userModel.findById(ObjectId);
       return instructor.averageRating;
      }

}