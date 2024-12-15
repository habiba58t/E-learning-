import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException, InternalServerErrorException,UseGuards,Req} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Courses} from './courses.schema';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { UpdateCourseDto } from './dto/UpdateCourse.dto';
import { Module, moduleDocument } from '../modules/modules.schema';
import { CreateModuleDto } from '../modules/dto/CreateModule.dto';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { UpdateModuleDto } from 'src/modules/dto/UpdateModule.dto';
import { courseDocument } from './courses.schema';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import {notificationDocument} from 'src/notification/notification.schema';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

  //GET ALL COURSES //PUBLIC 
  @Public() 
@Get()
  async findAll(): Promise<{ title: string; description: string }[]> {
    return this.coursesService.findAll();
  
  }

  // GET /Course/:course code: Retrieve a specific course by its course_code
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor,Role.User)
  @Get(':course_code')
  async findOne(@Param('course_code') course_code: string): Promise<courseDocument> {
    return this.coursesService.findOne(course_code);
  }

  // GET /Course/:course code: Retrieve a specific course by its title
  @Public() 
  @Get('title/:title')
  async findCourseByTitle(@Param('title') title: string): Promise<courseDocument> {
    return this.coursesService.findCourseByTitle(title);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor,Role.User)
  @Get('id/:ObjectId')
  async getcoursebyid(@Param('ObjectId') ObjectId: string): Promise<courseDocument> {
    const id = new mongoose.Types.ObjectId(ObjectId);
    return this.coursesService.getcoursebyid(id);
  }

    // GET /Course/:course code: Retrieve a specific instructor 
    @UseGuards(AuthGuard, AuthorizationGuard)
    @Roles(Role.Admin, Role.Instructor)
    @Get('coursesInstructor/:username')
    async findCoursesforInstructor(@Param('username') username: string): Promise<courseDocument[]> {
      return this.coursesService.findCoursesforInstructor(username);
    }


//Create: course created by instructor
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
   @Post('createCourse')
  async create(@Req() {user}, @Body() createCourseDto: CreateCourseDto ): Promise<Courses> {
    // Pass the username and course data to the service to create the course and associate it with the instructor
    return this.coursesService.create(createCourseDto,user);
  }

  // PUT /products/:id: Update an existing product by its ID
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor)
  @Put(':course_code')
  async update(@Req() {user},@Param('course_code') course_code: string, @Body() updateCourseDto: UpdateCourseDto): Promise<Courses> {
    return this.coursesService.update(course_code, updateCourseDto,user);
  }


  //GET: GET cousrse by module id
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor,Role.User)
 @Get('module/:moduleId')
async findCourseByModuleId(@Param('moduleId') moduleId: string):Promise<courseDocument>{
  const mid = new mongoose.Types.ObjectId(moduleId);
  return this.coursesService.findCourseByModuleId(mid)
}

  // Get modules for a student in a specific course
  @UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Admin, Role.User)
  @Get(':course_code/modules')
  async getModulesForCourseStudent(@Param('course_code') course_code: string,@Req(){user}): Promise<moduleDocument[]> {
    try {
      // Call the service method to get the filtered modules for the student
      return await this.coursesService.getModulesForCourseStudent(course_code, user);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Get modules for a instructor in a specific course
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor)
  @Get(':course_code/modulesInstructor')
  async getModulesForInstructor(@Param('course_code') course_code: string, @Req(){user}): Promise<moduleDocument[]> {
    // Call the service method to get the modules for the course
    const modules = await this.coursesService.getModulesForCourseInstructor(course_code,user);
    
    if (!modules || modules.length === 0) {
      throw new NotFoundException(`No modules found for course ${course_code}`);
    }

    return modules;
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor)
  @Put(':courseCode/modules')
  async addModuleToCourse(@Req() {user}, @Param('courseCode') courseCode: string,@Body() createModuleDto: CreateModuleDto): Promise<courseDocument> {
    return this.coursesService.addModuleToCourse(courseCode, createModuleDto,user);
}


@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
 @Put(':courseCode/modules/:title')
async DeleteModuleFromCourse( @Req (){user},@Param('courseCode') courseCode: string , @Param ('title')title:string): Promise<Courses> {
  return this.coursesService.DeleteModuleFromCourse(user,courseCode, title);
}

//GET: find outdated attributed of specific course
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Get('foutdated/:course_code')
  async findOutdated(@Param('course_code') course_code: string, @Req(){user}): Promise<boolean> {
    return this.coursesService.findOutdated(course_code,user);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor)
  @Put('upoutdated/:course_code')
  async toggleOutdated(@Param('course_code') course_code: string, @Req(){user}): Promise<Courses> {
    return this.coursesService.toggleOutdated(course_code,user);
  } 



  // Get average score of a specific course 
  @UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
  @Get(':course_code/average-score')
async getAverageScore(@Param('course_code') course_code: string): Promise<{ averageScore: number }> {
  const averageScore = await this.coursesService.getAverageScoreForCourse(course_code);
  return { averageScore };
}

// //Get AverageRating  of course
@Public()
   @Get('getavg/:courseId')
   async getAverageRating(@Param('courseId') courseId: string): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(courseId);
    return await this.coursesService.getAverageRating(objectId);
   }

//SET TOTALRATING TOTALSTUDENTS AVERAGE RATING
@UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Admin,Role.User)
@Put('setrate/:courseId/:score')
async setRating(@Param('courseId') courseId: string, @Param('score')score:number, @Req() {user}): Promise<void> {
  const objectId = new mongoose.Types.ObjectId(courseId);
  await this.coursesService.setRating(objectId,score,user);
}

//GET COURSE FOR SPECIFIC MODULE TITLE
@UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Admin,Role.User,Role.Instructor)
@Get('moduletitle/:title')
async getCourseForModule (@Param('title')title:string): Promise<courseDocument>{
return await this.coursesService.getCourseForModule(title);

}


//@UseGuards(JwtAuthGuard) // Ensures the user is authenticated
@UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Admin,Role.User)
@Get('studcour/:username/courses')
async getNonOutdatedCoursesForStudent(@Param('username') username: string) {
  return await this.coursesService.getNonOutdatedCoursesForStudent(username);
}

//DELETE COURSE (MAKE IT UNAVAILABLE)
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Put(':course_code/delete')
  async markCourseAsUnavailable(@Param('course_code') courseId: string, @Req(){user}) :Promise<courseDocument> {
    return await this.coursesService.deleteCourse(courseId,user);
  }
}