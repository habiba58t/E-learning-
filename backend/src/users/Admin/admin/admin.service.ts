import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/auth/decorators/role.decorator';
import { Users } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {

    constructor(private readonly usersService: UsersService) {}
    //GET ALL USERS
    async findUsersByFilters(username?: string, role?: Role): Promise<Users[]> {
        return this.usersService.findUsers(username, role);
    }
    


}
//Admin can delete himself or delete any other accout \
//Admin can update anything in the Website
//Admin checks  the logging
//Admin can getAll users by user name and role (filter by role) *DONE*
//if admin delete an account he must delete another user anything related to this user must be delete 
// Admin deletes A student => delete him from the courde he is enrooled in and delete his progress and notes
// Admin deletes An Instructor => if the courses of the instructor has enrolled students he cannot delete the instructor unless the all students finish the course
// after they finish the course the admin can delete the admin  but the course must not be deleted only marked as unavilable so it does not rewins the student progress
