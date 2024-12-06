import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { Users } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { AdminService } from './admin.service';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { LogsService } from 'src/users/logs/logs.service';

@Controller('admin')
export class AdminController {

    constructor(private readonly adminService: AdminService, private readonly logService: LogsService) {}

    @Get('users')
    @UseGuards(AuthorizationGuard)
    @Roles(Role.Admin)
    async findUsers( @Query('username') username?: string,@Query('role') role?: Role,): Promise<Users[]> {
        return this.adminService.findUsersByFilters(username, role);
    }

    @Get('logs')
    async getLogs(
    @Query('success') success?: boolean, 
    @Query('startDate') startDate?: string, 
    @Query('endDate') endDate?: string){
        const query: any = {};

        if (success !== undefined) {
            query.success = success === true; 
        }

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                query.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                query.timestamp.$lte = new Date(endDate);
            }
        }

        return this.logService.getFilteredLogs(query);
    }

    }


