import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './logs.schema';
import mongoose, { Model } from 'mongoose';
import { Role } from 'src/auth/decorators/role.decorator';

@Injectable()
export class LogsService {
   
    constructor(@InjectModel(Log.name) private logModel:Model<Log>){}

    async recordLog(username: mongoose.Types.ObjectId, action: string, success:boolean,role:Role):Promise<Log>{
        const log = new this.logModel({username, role, action, success, timestamp: new Date() });
        return log.save();
    }
    async getFilteredLogs(query: any): Promise<Log[]> {
        return this.logModel.find(query).sort({ timestamp: -1 }).exec();
    }

}