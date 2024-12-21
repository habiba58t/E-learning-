import { Injectable, NotFoundException, Inject, forwardRef, UseGuards } from '@nestjs/common';
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
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { CreateUserDto } from '../dto/createuser.dto';
import { userDocument } from '../users.schema';
import {Responses} from 'src/responses/responses.schema';
import { ResponsesService } from 'src/responses/responses.service';
import { NotesService } from 'src/notes/notes.service';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { CreateProgressDTo } from 'src/progress/dto/createProgress.dto';


@Injectable()
@UseGuards(AuthGuard)

export class StudentService {

  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>, //msh motakeda
    @InjectModel(Courses.name) private readonly courseModel: Model<Courses>,
    @InjectModel(Progress.name) private readonly progressModel: Model<Progress>,
    @InjectModel(Responses.name) private readonly responsesModel: Model<Responses>,
    @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProgressService)) private readonly progressService: ProgressService,
    @Inject(forwardRef(() => ResponsesService)) private readonly responsesService: ResponsesService,
    @Inject(forwardRef(() => NotesService)) private readonly notesService: NotesService,
){}


// @UseGuards(AuthorizationGuard)
// @Roles(Role.User)
    // Method to enroll a student in a course
async enrollStudentInCourse(user: any, courseId: string): Promise<userDocument> {
        // Find the student by username
        const student = await this.userModel.findOne({username: user.username}).exec();
        if (!student) {
          throw new NotFoundException(`Student with username ${user.username} not found`);
        }
    
        // Find the course by its ID
        const course = await this.coursesService.findOne(courseId);
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
        await student.save();
        console.log(`student username ${student.username} !!`)
      // Prepare the progress data
    const progressDto= {  //only course code and last accessed seen?
      Username: student.username,
      course_code: course.course_code, 
      completetion_percentage: 0,
      last_accessed: new Date() 
  };

  console.log(`student username ${student.username} !! x2`)
  console.log(`student completion ${progressDto.completetion_percentage} !! `)  //till here tmamm

  // Create the progress record
  const createdProgress = await this.progressService.create(progressDto);
        // Save the updated student document
        await student.save();
    
        // Return the updated student
        return student;
      }

  
      
      async getisEnrolled(username:string, objectId:string): Promise<string>{  // i have course objectid 
        const cid = new mongoose.Types.ObjectId(objectId)
        const student =await this.userModel.findOne({username})
        if (!student || !student.courses) {
          return "no"; // User not found or no courses array
        }
        const isEnrolled = student.courses.includes(cid);
      
        return isEnrolled? "yes": "no";
      }
      

//GET STUDENT SCORE
@UseGuards(AuthorizationGuard)
@Roles(Role.User, Role.Admin, Role.Instructor)
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

async getnumberOfEasyLevel(courseId: mongoose.Types.ObjectId): Promise<number> {
  let easyCount = 0; // Counter for easy level students



  // Get all students enrolled in the course
  const students = await this.usersService.getEnrolledStudents(courseId);

  // Iterate over each student
  for (const student of students) {
    const username = student; // Assuming username is a property of student
    const level = await this.getStudentLevel(username, courseId); // Pass ObjectId

    // Check if the level is "easy"
    if (level === "easy") {
      easyCount++; // Increment the count
    }
  }

  return easyCount; // Return the number of easy-level students
 
}

async getnumberMediumLevel(courseId: mongoose.Types.ObjectId): Promise<number> {
  let mediumCount = 0; // Counter for easy level students



  // Get all students enrolled in the course
  const students = await this.usersService.getEnrolledStudents(courseId);

  // Iterate over each student
  for (const student of students) {
    const username = student; 
    const level = await this.getStudentLevel(username, courseId); // Pass ObjectId

    // Check if the level is "easy"
    if (level === "medium") {
      mediumCount++; // Increment the count
    }
  }

  return mediumCount; // Return the number of easy-level students
}




async getnumberHardLevel(courseId: mongoose.Types.ObjectId): Promise<number> {
  let hadrdLevel = 0; // Counter for easy level students



  // Get all students enrolled in the course
  const students = await this.usersService.getEnrolledStudents(courseId);

  // Iterate over each student
  for (const student of students) {
    const username = student; // Assuming username is a property of student
    const level = await this.getStudentLevel(username, courseId); // Pass ObjectId

    // Check if the level is "easy"
    if (level === "medium") {
      hadrdLevel++; // Increment the count
    }
  }

  return hadrdLevel; // Return the number of easy-level students
}




//GET STUDENT Level
@UseGuards(AuthorizationGuard)
@Roles(Role.User, Role.Admin, Role.Instructor)
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

//SET STUDENT level
private async setStudentLevel(username: string, objectId: mongoose.Types.ObjectId, updatedScore: number): Promise<void> {
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

//GET ALL NOTES OBJECT ID FOR A SPECIFIC MODULE FOR A specific student
@UseGuards(AuthorizationGuard)
@Roles(Role.User)
   async getAllNotesForModule(moduleId: mongoose.Types.ObjectId, username:string): Promise<mongoose.Types.ObjectId[] | null> {
     const student = await this.userModel.findOne({username: username});
     return student.notes.get(moduleId);
   }

@UseGuards(AuthorizationGuard)
@Roles(Role.User, Role.Admin, Role.Instructor)
//Delete Student, their progress,responses and notes 
async deleteStudentAndRelatedData(username: string): Promise<void> {
  // Check if the student exists
  const student = await this.userModel.findOne({ username });
  if (!student) {
    throw new Error(`Student with username ${username} not found`);
  }

  // Delete all responses using the existing method
  try {
    await this.responsesService.deleteResponseByUsername(username);
  } catch (error) {
    console.error(`Failed to delete responses for username: ${username}`, error);
    throw new Error('Failed to delete responses.');
  }

  // Delete all progress using the existing method
  try {
    await this.progressService.deleteProgressByUsername(username);
  } catch (error) {
    console.error(`Failed to delete progress for username: ${username}`, error);
    throw new Error('Failed to delete progress.');
  }

  // Delete all notes using the existing method
  try {
    await this.notesService.deleteNoteByUsername(username);
  } catch (error) {
    console.error(`Failed to delete notes for username: ${username}`, error);
    throw new Error('Failed to delete notes.');
  }

  // Finally, delete the student from the user table
  try {
    await this.userModel.deleteOne({ username });
  } catch (error) {
    console.error(`Failed to delete student with username: ${username}`, error);
    throw new Error('Failed to delete student.');
  }
}

}