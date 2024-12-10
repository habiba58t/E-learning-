import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Role } from 'src/auth/decorators/role.decorator';
import { userDocument, Users } from '../users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
    constructor(private  usersService: UsersService,
    @InjectModel(Users.name) private readonly userModel: Model<userDocument>,

    ) {}
    //GET ALL USERS
    async findUsersByFilters(username?: string, role?: Role): Promise<Users[]> {
        return this.usersService.findUsers(username, role);
    }
    async deleteAdmin(username: string):Promise<void>{
        await this.userModel.findOneAndDelete({username});
    }
   
}
