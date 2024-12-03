import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';
import { Model } from 'mongoose';
import { Courses} from 'src/courses/courses.schema';
import { Role } from 'src/auth/decorators/role.decorator';

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

    //base find users api can be called in the 3 folders
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





}
