
import { Injectable, NotFoundException, Inject, forwardRef ,InternalServerErrorException,BadRequestException,Req,UseGuards,UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { courseDocument, Courses } from './courses.schema';
import { Module } from '../modules/modules.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { UpdateCourseDto } from './dto/UpdateCourse.dto';
import { ModulesService } from '../modules/modules.service';
import { CreateModuleDto } from 'src/modules/dto/CreateModule.dto';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { moduleDocument } from '../modules/modules.schema';
import { userDocument } from 'src/users/users.schema';
import { Users } from 'src/users/users.schema';
import { HydratedDocument } from 'mongoose';
import { ProgressService } from 'src/progress/progress.service';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import {NotificationService} from 'src/notification/notification.service';
import {notificationDocument} from 'src/notification/notification.schema';
import { UsersService } from 'src/users/users.service';
import { promises } from 'dns';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Courses.name) private readonly courseModel: Model<courseDocument>,
    @InjectModel(Module.name) private readonly moduleModel: Model<moduleDocument>,
    @InjectModel(Users.name) private readonly userModel: Model<userDocument>,
      @Inject(forwardRef(() => ModulesService)) private readonly modulesService: ModulesService,
      @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService,
      @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
      @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    ) {}
    
  //GET ALL COURSES //PUBLIC  
  
  async findAll(): Promise<{ title: string; description: string }[]> {
    return this.courseModel
      .find({ Unavailable: false }) // Filter to get only available courses
      .select('title description averageRating created_by category')  // Select only title and description fields
      .exec();
  }

  async findCoursesAdmin(): Promise<courseDocument[]> {
    return this.courseModel.find({ Unavailable: false }) .exec();
  }
    

 //FIND COURSE BY COURSE_CODE 
  async findOne(course_code: string): Promise<courseDocument> {
    const course = await this.courseModel.findOne({ course_code, Unavailable: false }).exec();
    if (!course) {
      throw new NotFoundException(`Course with course code ${course_code} not found or unavailable`);
    }
  
    return course;
  }

   // GET /Course/:course code: Retrieve a specific instructor 

   async findCoursesforInstructor(username: string): Promise<courseDocument[]> {
    const courses= await this.courseModel.find({ created_by: username , Unavailable:false}).exec();
    return courses || [];
   }

   // GET /Course/:course code: Retrieve a specific instructor 
   async findCoursesforInstructorByTitle(username: string, title: string): Promise<courseDocument[]> {
    const course = await this.courseModel.find({title: { $regex: title, $options: 'i' },created_by: username}).exec();
    if (!course) {
      throw new NotFoundException(`Course with title ${title} not found`);
    }
    return course;
   }


  //GET: find course by course titl
  async findCourseByTitle(title: string): Promise<courseDocument[]> {
    const course = await this.courseModel.find({title: { $regex: title, $options: 'i' },Unavailable: false}).exec();
    if (!course) {
      throw new NotFoundException(`Course with title ${title} not found`);
    }
    return course;
  }

  //get course by objectId
  async getcoursebyid(objectId: mongoose.Types.ObjectId): Promise<courseDocument> {
    const course = await this.courseModel.findById(objectId);
    if (!course) {
      throw new NotFoundException(`course with Object id ${objectId} not found`);
    }
    return course;
  }


  //CREATE: intructor create course
  async create(createCourseDto: CreateCourseDto): Promise<courseDocument> {
    try {
    const username = createCourseDto.created_by;
    const newCourse = new this.courseModel(createCourseDto); // Step 1: Create the new course
   // newCourse.Unavailable=false;
    newCourse.created_at = new Date();
    const savedCourse = await newCourse.save();
     
    // Step 2: Find the instructor by their username
    const instructor = await this.userModel.findOne({ username}).exec();
    if (!instructor) {
      throw new NotFoundException(`Instructor with username ${username} not found`);
    }

    // Step 3: Add the new course's ObjectId to the instructor's courses array
    instructor.courses.push(savedCourse._id);  // Cast _id to the correct type

    // Step 4: Save the updated instructor
    await instructor.save();

    // Step 5: Return the newly created course
    return savedCourse;
  } catch (err) {
    console.error('Error creating course:', err);
    throw new InternalServerErrorException('Failed to create course');
  }
  }

 // Update an existing course by ID
  async update(course_code: string, updateCourseDto: UpdateCourseDto, username:string): Promise<courseDocument> {
    const user= await this.usersService.findUserByUsername(username);
    const course = await this.courseModel.findOne({ course_code, Unavailable: false }).exec();
  
    if (!course) {
      throw new NotFoundException(  `Course with Course code${course_code} not found`);
    }
    // Check if the user is the instructor or an admin
  const isInstructor = course.created_by === username;
  const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to update this course');
  }

    const updatedCourse = await this.courseModel.findOneAndUpdate({ course_code, Unavailable: false }, updateCourseDto, { new: true }).exec();

    if (!updatedCourse) {
      throw new NotFoundException(`Course with course code ${course_code} not found`);
    }

    return updatedCourse;
  }

 //GET: find course by module
async findCourseByModuleId(moduleId:mongoose.Types.ObjectId):Promise<courseDocument>{
  const course = await this.courseModel.findOne({ modules: {$in: [moduleId]},Unavailable: false })
  return course;
}

//GET: modules for a course for a student
async getModulesForCourseStudent(course_code: string,username: string,): Promise<moduleDocument[]> {

  const student = await this.userModel.findOne({username }).exec();
  console.log('Student fetched:', student);
  if (!student) {
    throw new NotFoundException(`Student with username ${username} not found`);
  }

  // Step 2: Fetch the course by its code
  const course = await this.courseModel.findOne({ course_code: course_code,Unavailable: false }).exec();
 // await this.findOne(course_code);
 console.log('Course fetched:', course);
  if (!course) {
    throw new NotFoundException(`Course with code ${course_code} not found`);
  }

  // Step 3: Fetch all modules for the course
  const modules = await this.moduleModel.find({
    _id: { $in: course.modules }, // Match ObjectIds in `course.modules`
  }).exec();

  console.log('Modules fetched:', modules);

  // Step 4: Filter the modules based on the student's level and outdated status
  const validModules = modules.filter(module => {
    const studentLevel = student.studentLevel.get(course._id); // Get the student's level for the current course using the course _id
    return studentLevel === module.level && !module.isOutdated;
   } // Return modules that match the student's level and are not outdated
);


//console.log('Valid modules:', validModules);

  return validModules;
}

// GET: modules for a course for an instructor
async getModulesForCourseInstructor(course_code: string, username: string): Promise<moduleDocument[]> {
  // Find the course by course_code
  const course = await this.courseModel.findOne({ course_code }).exec();
  if (!course) {
    throw new NotFoundException(`Course with course code ${course_code} not found`);
  }

  if (username !== course.created_by) {
    throw new UnauthorizedException('You are not authorized to view modules of this course');
  }

  // Fetch all modules by their ObjectIds
  const modules = await this.moduleModel.find({ _id: { $in: course.modules } }).exec();
  
  // Return an empty array if no modules exist
  return modules.length ? modules : [];
}

// GET: modules for a course for an instructor
async getModulesForAdmin(course_code: string): Promise<moduleDocument[]> {
  // Find the course by course_code
  const course = await this.courseModel.findOne({ course_code }).exec();
  if (!course) {
    throw new NotFoundException(`Course with course code ${course_code} not found`);
  }

  // Fetch all modules by their ObjectIds
  const modules = await this.moduleModel.find({ _id: { $in: course.modules } }).exec();
  
  // Return an empty array if no modules exist
  return modules.length ? modules : [];
}


//PUT: add module to a course
async addModuleToCourse(courseCode: string, createModuleDto: CreateModuleDto,username: string): Promise<courseDocument> {
   // Find the course by course code
   const course = await this.courseModel.findOne({ course_code: courseCode ,Unavailable: false}).exec();
   if (!course) {
     throw new NotFoundException(`Course with Course code ${courseCode} not found`);
   }
   const user= await this.usersService.findUserByUsername(username);
   const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin';

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to view questions of this module');
  } 
  // Create new module and save it to the database
  const newModule = await this.modulesService.create(createModuleDto);

  // Check if the module was created successfully and has an _id
  if (!newModule || !newModule._id) {
    throw new Error('Failed to create the module.');
  }

  course.modules.push(newModule._id);

  const updatedCourse = await course.save();

  //Notification creation:
  const title=`a new module called ${newModule.title} in course ${course.title} has been added`;
  const NotificationDto = {
    message: title
  };
  const notification= await this.notificationService.createModuleNotification(course.course_code,NotificationDto);

  return course;
}

//PUT: remove module from array of modules in specific course
async DeleteModuleFromCourse(username: string,courseCode: string, title:string): Promise<courseDocument> {
  const course= await this.findOne(courseCode);
  const user= await this.usersService.findUserByUsername(username);
  const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin';

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to view questions of this module');
  } 
  const deletedModule= await this.modulesService.delete(title);
  // Use $pull to remove the moduleId from the modules array atomically
  const updatedCourse = await this.courseModel.findOneAndUpdate({ course_code: courseCode,Unavailable: false }, { $pull: { modules: deletedModule._id} },{ new: true } ).exec();
  if (!updatedCourse) {
    throw new NotFoundException(`Course with course code ${courseCode} not found`);
  }

  return updatedCourse;  // Return the updated course
}

//GET: find course outdated attribute by course code
async findOutdated(course_code: string,user:any): Promise<boolean> {
  const course = await this.courseModel.findOne({ course_code }) 
  if (!course) {
    throw new NotFoundException(`Course with course code ${course_code} not found`);
  }
  const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin'; 

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized');
  } 

  return course.isOutdated === true;
}

//PUT: change outdated of course
async toggleOutdated(course_code: string,username:string): Promise<courseDocument> {
  const course = await this.courseModel.findOne({ course_code }) ;
  if (!course) {
    throw new NotFoundException(`Course with course code ${course_code} not found`);
  }
  const user= await this .usersService.findUserByUsername(username);
  
  if (user.role ==="student") {
    throw new UnauthorizedException('You are not authorized');
  } 
  course.isOutdated = !course.isOutdated;
  return await course.save();
}


// Get Average score of a specific module 
async getAverageScoreForCourse(course_code: string): Promise<number> {
  // Step 1: Find the course and deeply populate nested fields
  const course = await this.courseModel
    .findOne({ course_code,  Unavailable: false })
    .populate({
      path: 'modules', // Populate modules
      populate: {
        path: 'quizzes', // Populate quizzes within modules
        populate: {
          path: 'responses', // Populate responses within quizzes
          select: 'score', // Only fetch the 'score' field
        },
      },
    })
    .exec();

  if (!course) {
    throw new NotFoundException(`Course with code ${course_code} not found`);
  }

  // Step 2: Traverse through populated modules, quizzes, and responses
  let totalScore = 0;
  let totalResponses = 0;

  course.modules.forEach((module: any) => {
    module.quizzes.forEach((quiz: any) => {
      quiz.responses.forEach((response: any) => {
        totalScore += response.score; // Accumulate scores
        totalResponses += 1; // Count responses
      });
    });
  });

  // Step 3: Calculate average and return
  if (totalResponses === 0) {
    return 0; // No responses, average is 0
  }

  const averageScore = totalScore / totalResponses;
  return averageScore;
}

//GET AVERAGE RATING
async getAverageRating( ObjectId: mongoose.Types.ObjectId): Promise<number> {
  const course = await this.getcoursebyid(ObjectId);
  if(await(course.Unavailable) ===false){
  return course.averageRating;
  }else 
  throw new NotFoundException(`course unavailable`);
 }
 
 
 //SET RATING,TOTAL,AVERAGE
 async setRating(objectId: mongoose.Types.ObjectId,score:number,user:any): Promise<void> {
   const course = await this.getcoursebyid(objectId);
   if(await(course.Unavailable) !==false){
    throw new NotFoundException(`course unavailable`);
   }
   if (!course) {
    throw new NotFoundException(`Course with code ${objectId} not found`);
  }
   const students= await this.progressService.findAllByCourse(course.course_code);
  const found = students.some(student => student.Username === user.username);
const isAdmin = user.role === 'admin';

  if (!found && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to view questions of this module');
  } 
  const totalRating = Number(course.totalRating) || 0 ;
const totalStudents = Number(course.totalStudents) || 0;
const newScore = Number(score);

course.totalRating = totalRating + newScore;
course.totalStudents = totalStudents + 1;
course.averageRating = course.totalRating / course.totalStudents;

  // Save the updated document
  await course.save();
 }

 //GET courses for student   //admin not implemented i think?
async getNonOutdatedCoursesForStudent(username: string): Promise<Courses[]> {
  // Find the student by username
  const student = await this.userModel.findOne({ username }).exec();
  if (!student) {
    throw new Error('Student not found');
  }

  // Retrieve courses based on their ObjectIds
  const courses: Courses[] = [];
  for (const courseId of student.courses) {
    const course = await this.getcoursebyid(courseId); // Use existing method
    if (course && !course.isOutdated && !course.Unavailable) {
      courses.push(course);
    }
  }

  return courses;
}

//GET COURSE FOR SPECIFIC MODULE TITLE
async getCourseForModule (moduleTitle:string): Promise<courseDocument>{
 const module=await this.modulesService.findByTitle(moduleTitle);

 return await this.findCourseByModuleId(module._id)

}



//DELETE COURSE (MAKE IT UNAVAILABLE)
async deleteCourse(course_code: string,username: string): Promise <courseDocument>{//Promise<{ message: string }> {
  const course = await this.courseModel.findOne({ course_code, Unavailable: false }).exec();
    if (!course) {
      throw new NotFoundException(  `Course with Course code${course_code} not found`);
    }
    const user= await this.usersService.findUserByUsername(username);
    const isInstructor = course.created_by === user.username;
    const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object
    if (!isInstructor && !isAdmin) {
      throw new UnauthorizedException('You are not authorized to view questions of this module');
    } 

  // Fetch all progress records for the course
  const progressRecords = await this.progressService.findAllByCourse(course_code);

  // Check if all progress records have 100% completion
  const allCompleted = progressRecords.every(progress => progress.completion_percentage === 100);

  if (!allCompleted) {
    throw new BadRequestException('Cannot delete course until all students have 100% completion');
  }

  // Mark course as unavailable
  const updatedCourse = await this.courseModel.findOneAndUpdate(
    { course_code },
    { Unavailable: true },
    { new: true } 
  );

  if (!updatedCourse) {
    throw new NotFoundException('Course not found');
  }

  return updatedCourse;
}

async getcoursesforuser(username: string): Promise<courseDocument[]> {
  const students= await this.usersService.findUserByUsername(username);
  // Step 1: Fetch the student by their username
  const student = await this.userModel.findOne({ username}).exec();
  if (!student) {
    throw new NotFoundException(`Student with username ${username} not found`);
  }

  const courses = await this.courseModel.find({_id: { $in: student.courses }}).exec();

  return courses;
}

async findByCategory(category: string): Promise<Courses[]> {
  return this.courseModel.find({ category }).exec(); 
}

async getAllCategories(): Promise<string[]> {
  const categories = await this.courseModel.distinct('category');
  return categories;
}
async getModulesforInstructor(course_code: string, user: any): Promise<moduleDocument[]> {
  const course = await this.courseModel.findOne({ course_code }).exec();
  
  if (!course) {
    throw new NotFoundException(`Course with Course code ${course_code} not found`);
  }

  // Authorization check: Ensure the user is the instructor or an admin
  const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object
  
  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to view modules for this course');
  }

  // Fetch modules by their ObjectIds from the course's modules array
  const modules = await this.moduleModel.find({ _id: { $in: course.modules } }).exec();
  
  // If no modules are found, you could return an empty array instead of null for consistency
  return modules || []; // Return an empty array if no modules are found
}

//GET courses for student   //admin not implemented i think?
async getNonOutdatedCoursesForStudent2(username: string): Promise<courseDocument[]> {
  // Find the student by username
  const student = await this.userModel.findOne({ username }).exec();
  if (!student) {
    throw new Error('Student not found');
  }

  // Retrieve courses based on their ObjectIds
  const courses: courseDocument[] = [];
  for (const courseId of student.courses) {
    const course = await this.getcoursebyid(courseId); // Use existing method
    if (course && !course.isOutdated && !course.Unavailable) {
      courses.push(course);
    }
  }

  return courses;
}

//GET: modules for a course for a student
async getModulesForCourseStudent2(course_code: string, user: any): Promise<moduleDocument[]> {
  const students= await this.progressService.findAllByCourse(course_code);
  const found = students.some(student => student.Username === user.username);
if (!found ) {
    throw new Error(`User with username ${user.username}not enrolled in the course`);
}
  // Step 1: Fetch the student by their username
  const student = await this.userModel.findOne({ username:user.username }).exec();
  if (!student) {
    throw new NotFoundException(`Student with username ${user.username} not found`);
  }

  // Step 2: Fetch the course by its code
  const course = await this.courseModel.findOne({ course_code: course_code,Unavailable: false }).exec();
 // await this.findOne(course_code);
  if (!course) {
    throw new NotFoundException(`Course with code ${course_code} not found`);
  }

  // Step 3: Fetch all modules for the course
  const modules = await this.moduleModel.find({
    _id: { $in: course.modules }, // Match ObjectIds in `course.modules`
  }).exec();

  // Step 4: Filter the modules based on the student's level and outdated status
  const validModules = modules.filter(module => {
    const studentLevel = student.studentLevel.get(course._id); // Get the student's level for the current course using the course _id
    return studentLevel === module.level && !module.isOutdated; // Return modules that match the student's level and are not outdated
});

  return validModules;
}

async getTotalCourses():Promise<number>{
  return await this.courseModel.countDocuments();
}
}