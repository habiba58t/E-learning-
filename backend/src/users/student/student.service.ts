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
import { ProgressService } from 'src/progress/progress.service';
import { Progress } from 'src/progress/progress.schema';
import { HydratedDocument } from 'mongoose';
@Injectable()
export class StudentService {

    constructor(
        @InjectModel(Users.name) private readonly userModel: Model<Users>, //msh motakeda
        @InjectModel(Courses.name) private readonly courseModel: Model<Courses>,
        @InjectModel(Progress.name) private readonly progressModel: Model<Progress>,
        @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService,
    ){}

    //GET: all courses student enrolled in and not outdated                 DONE EXCEPT USERNAME NEED TO GET FROM TOKEN
 //   async getCoursesForStudent(): Promise<Courses[]> {
        // Step 1: Get the courses array for the user
  //      const coursesArray = await this.usersService.findCoursesArray(this.userModel.username);
      
        // Step 2: Fetch all courses by their ObjectIds
   //     const courses = await this.courseModel.find({
    //      _id: { $in: coursesArray }, // Match ObjectIds from coursesArray
   //     }).exec();
      
        // Step 3: Filter non-outdated courses
    //    const validCourses = courses.filter((course) => !course.isOutdated);
      
  //      return validCourses;
    //  }


    // Method to enroll a student in a course
    async enrollStudentInCourse(username: string, courseId: string): Promise<Users> {
        // Find the student by username
        const student = await this.userModel.findOne({ username }).exec();
        if (!student) {
          throw new NotFoundException(`Student with username ${username} not found`);
        }
    
        // Find the course by its ID
        const course = await this.courseModel.findById(courseId).exec();
        if (!course) {
          throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
    
        // Check if the student is already enrolled in the course
        // The 'student.courses' array contains ObjectIds, so compare with course._id
        if (student.courses.includes(course._id)) {
          throw new Error(`Student is already enrolled in this course`);
        }
    
        // Add the course's ObjectId to the student's courses array
        student.courses.push(course._id);
        student.studentScore.set(course._id, 0); 
        student.studentLevel.set(course._id, 'easy');
       const username1=student.username;
      // Prepare the progress data
    const progressDto= {
      username: student.username,
      course_code: course._id, 
      completetion_percentage: 0,
      last_accessed: new Date() 
  };

  // Create the progress record
  //const createdProgress = await this.progressService.create(progressDto);
        // Save the updated student document
        await student.save();
    
        // Return the updated student
        return student;
      }


//GET STUDENT SCORE
async getStudentScore(username: string, objectId: mongoose.Types.ObjectId): Promise<number | null> {
  // Find the user by username
  const student = await this.usersService.findUserByUsername(username);

  if (!student) {
    throw new Error(`User with username ${username} not found`);
  }

  // Ensure studentScore exists and is a Map
  if (!student.studentScore || !(student.studentScore instanceof Map)) {
    throw new Error(`Student score not found for user ${username}`);
  }

  // Retrieve the score using the ObjectId as the key
  const score = student.studentScore.get(objectId);

  // Return the score or null if not found
  return score ?? null;
}

//GET STUDENT Level
async getStudentLevel(username: string, objectId: mongoose.Types.ObjectId): Promise<string | null> {
  // Find the user by username
  const student = await this.usersService.findUserByUsername(username);

  if (!student) {
    throw new Error(`User with username ${username} not found`);
  }

  // Ensure studentScore exists and is a Map
  if (!student.studentLevel || !(student.studentLevel instanceof Map)) {
    throw new Error(`Student level not found for user ${username}`);
  }

  // Retrieve the score using the ObjectId as the key
  const level = student.studentLevel.get(objectId);

  // Return the score or null if not found
  return level ?? null;
}

//SET STUDENT SCORE
async setStudentScore(username: string, objectId: mongoose.Types.ObjectId, newScore: number): Promise<void> {
  // Find the user by username
  const student: HydratedDocument<Users> = await this.userModel.findOne({ username });

  if (!student) {
    throw new Error(`User with username ${username} not found`);
  }

  if (!student.studentScore || !(student.studentScore instanceof Map)) {
    throw new Error(`Student score map not found for user ${username}`);
  }

  const currentScore = student.studentScore.get(objectId); 
  const updatedScore = currentScore + newScore;

  // Set the new score in the map
  student.studentScore.set(objectId, updatedScore);


  await student.save();
  await this.setStudentLevel(username,objectId, updatedScore);
 
}

//SET STUDENT SCORE
async setStudentLevel(username: string, objectId: mongoose.Types.ObjectId, updatedScore: number): Promise<void> {
  // Find the user by username
  const student: HydratedDocument<Users> = await this.userModel.findOne({ username });

  if (!student) {
    throw new Error(`User with username ${username} not found`);
  }

  if (!student.studentLevel || !(student.studentLevel instanceof Map)) {
    throw new Error(`Student score map not found for user ${username}`);
  }
  let Newlevel: string;
    if (updatedScore >= 0 && updatedScore <= 2.9) {
      Newlevel = 'easy';
    } else if (updatedScore >= 3 && updatedScore <= 6.9) {
      Newlevel = 'medium';
    } else if (updatedScore >= 7) {
      Newlevel = 'hard';
    } else {
      Newlevel = 'easy'; // Default 
    }
  const level = student.studentLevel.get(objectId);
  if (level != Newlevel) {
  student.studentLevel.set(objectId,Newlevel);
  }


  await student.save();

}

}
