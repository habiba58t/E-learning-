import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Log } from './log.schema';
@Injectable()
export class LogsService {
    constructor(@InjectModel(Log.name) private logModel: mongoose.Model<Log>) {}

    // Method to get filtered logs for Admin
    async getFilteredLogs(query: any): Promise<Log[]> {
        return this.logModel
          .find(query)
          .populate('username', 'username') // Populate the 'username' field with the actual username
          .sort({ timestamp: -1 })
          .exec();
      }

      // Method to fetch failed login attempts for a specific user
      async getFailedLoginAttempts(username: mongoose.Types.ObjectId): Promise<Log[]> {
        return this.logModel
          .find({
            username,
            success: false,
            action: 'Login Failed',
          })
          .populate('username', 'username') // Populate the 'username' field
          .sort({ timestamp: -1 })
          .exec();
      }
}