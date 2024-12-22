import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BackupService } from '../services/backup.service';

@Injectable()
export class BackupSchedulerService {
  constructor(private readonly backupService: BackupService) {}

  @Cron('0 0 * * *') // Every day at midnight
  async handleScheduledBackup() {
    try {
      const backupDir = await this.backupService.createBackup();
      console.log(`Scheduled backup created at: ${backupDir}`);
    } catch (error) {
      console.error('Failed to create scheduled backup:', error);
    }
  }
}
