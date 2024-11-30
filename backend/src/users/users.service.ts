import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';
import { Model } from 'mongoose';
import { Courses} from 'src/courses/courses.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(Users.name) private readonly userModel: Model<Users>, ){}

    //GET: get array of courses for a speicifc user
    // async findCoursesArray(username: string): Promise<Courses[]> {
    //     const found= await this.userModel.findOne({username });
    //     if (!found) {
    //         throw new NotFoundException(`User with username ${username} not found`);
    //       }
    //     return found.courses;
    // }





}
