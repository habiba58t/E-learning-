import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException  } from '@nestjs/common';
import { UsersService } from './users.service';
import * as mongoose from 'mongoose';
import { Courses } from 'src/courses/courses.schema';
import { Users, UsersSchema } from './users.schema';
import { userDocument } from './users.schema';
import { UseGuards } from '@nestjs/common';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
//import { SearchUserDto } from './dto/search-user.dto';
import {  Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { SearchUserDto } from './dto/SearchUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  //GET USER BY username
  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<userDocument> {
    return this.usersService.findUserByUsername(username);
  }

  @UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin)
@Get(':username/validation')
  async validation(@Param('username') username: string): Promise<boolean> {
   return await this.usersService.validation(username);
  }

  
  
 //GETT ALL USERS ENROLLED IN A COURSE
 @UseGuards(AuthorizationGuard)
@Roles(Role.User, Role.Admin, Role.Instructor)
 @Get() 
   async getEnrolledStudents(@Param('objectId')objectId: mongoose.Types.ObjectId): Promise<string[]>{
     return this.usersService.getEnrolledStudents(objectId);
   }


  //doesn;t work?
  // GET API to search users
  @UseGuards(AuthGuard)
  @Get('search/private')
 // Apply AuthGuard to handle token validation
  async searchUsers(
    @Req() req, // Access the authenticated user's data if logged in
    @Query() searchUserDto: SearchUserDto, // Query parameters for filters
  ) {
    console.log('SearchUsers endpoint hit'); // Debugging line
    console.log(req.user.username)
    // Check if the user is logged in; req.user will be undefined if no token
    const loggedInUserId = req.user?.username || null;

    // Pass the user ID and search filters to the service
    return this.usersService.searchUsers(loggedInUserId, searchUserDto);
  }
  

  // GET API to search users without authentication (public search for instructors only)
  @Get('search/public')
  async searchPublicUsers(
    @Query() searchUserDto: SearchUserDto,  // Search filters
  ) {
    // If not logged in, you can only filter for instructors
    if (searchUserDto.role && searchUserDto.role !== 'instructor') {
      throw new HttpException('You are not logged in to search for students.',HttpStatus.FORBIDDEN);
    }

    // Perform search for instructors only
    return this.usersService.searchUsers(null, searchUserDto);
  }

  //Update student profile
  @Put('update/:username')
  async updateProfile(@Param('username') username: string,@Body() updateUserDto: UpdateUserDto, ): Promise<any>{
    const updatedUser = await this.usersService.updateProfile(username, updateUserDto);
    return {
      message: 'User profile updated successfully.',
      user: updatedUser,
    };
  }


  @Delete('delete/:username')
async deleteProfile(@Param('username') username: string):Promise<userDocument>{
  return await this.usersService.deleteUser(username);
}



// @Roles(Role.Admin)
@Get('count/users')
async getUserCount(): Promise<{ count: number }> {
  const count = await this.usersService.getTotalNumberOfUsers();
  return { count };
}


}