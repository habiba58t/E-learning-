import { Controller, Get, Query } from '@nestjs/common';
import { Roles, Role } from 'src/auth/decorators/role.decorator';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {

    constructor(private readonly logsService: LogsService) {}

    @Roles(Role.Admin)  // Ensure only admin can access this route
    @Get()
    async getLogs(@Query() query: any) {
        const logs = await this.logsService.getFilteredLogs(query);
        return logs;
    }
}
