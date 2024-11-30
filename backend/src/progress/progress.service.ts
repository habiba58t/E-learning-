import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Progress , ProgressDocument } from './progress.schema';
import { CoursesService } from 'src/courses/courses.service';
import { CoursesSchema } from 'src/courses/courses.schema';
import { CreateProgressDTo } from './dto/createProgress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>, private coursesService: CoursesService 
  ) {}

    async findAll():Promise<Progress[]>{
        let progresses= await this.progressModel.find();
        return progresses;
    }
    async findAllByCourse(course_code:string):Promise<Progress[]>{  //instructor eyshoof progress of all students in a specific course 
      let progresses= await this.progressModel.find();
      return progresses;
  }
  
  async findbyUsername(username: string):Promise<Progress[]>{  
    return await this.progressModel.findOne({username});
  }

  async findByUsernameAndCourseCode(username: string, course_code: string): Promise<Progress> { //instructer beyshoof progress of a student 
    return await this.progressModel.findOne({ username, course_code });
}
  async findbyCourseCode(course_code: string):Promise<Progress>{ //for a student finding a progress in a course 
    return await this.progressModel.findOne({course_code}); 
    }


    async update(
        course_code: string,
        username: string,
        updateData: { completion_percentage: number; last_accessed: Date }
      ): Promise<Progress> {
        return await this.progressModel.findOneAndUpdate(
          { username, course_code },
          updateData,
          { new: true }
        );
      }

      //createeee
      async create(progressData: CreateProgressDTo): Promise<Progress> {
        const createdProgress = new this.progressModel(progressData);
        return createdProgress.save();  // Save to the database
      }




      //deletee
      async delete(course_code: string, username: string): Promise<Progress> {
        return await this.progressModel.findOneAndDelete({ course_code, username });
    }
    
     

      //same as above bas return call findby coursecode and return lenghth of array. number of students enrolled. getStudentEnrolled
      async findAllStudentsEnrolled(course_code: string): Promise<number> {
        const students = await this.findAllByCourse(course_code);
        return students.length;
      }
      
      
      
      //completed: the array aboth, filter who finished. kol student check if completetion is 100 . getStudentsCOmpleted
      async findAllStudentsCompleted(course_code: string): Promise<Progress[]> {
        const students = await this.findAllByCourse(course_code); // Get all progress documents for the course
        
        // Filter students with completion_percentage = 100
        const completedStudents = students.filter(student => student.completion_percentage === 100);
      
        return completedStudents; 
      }
      


      // get length of modules array mn course code(total number of modules), how many modules completed per user needed . getModulesCompleted
      async getTotalModules(course_code: string): Promise<number> {
        const total= await this.coursesService.getModulesForCourse(course_code); 
        return total.length;// Call the method from CoursesService
      }

      async getTotalModulesCompleted(course_code: string, username: string):Promise<number>{
        const studentProgress = await this.progressModel.findOne({ Username: username, course_code });

        if (!studentProgress) {
          throw new Error('Student progress not found');
        }
         // Get the total number of modules for the course
    const totalModules = await this.getTotalModules(course_code);  // This calls getModulesForCourse from CoursesService

    // Calculate the number of completed modules based on completion_percentage
    const completedModules = Math.round((studentProgress.completion_percentage / 100) * totalModules);

    return completedModules;
  
      }
  

      
      

}
