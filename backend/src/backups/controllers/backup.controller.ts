import { Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { BackupService } from '../services/backup.service'; // Adjust the import based on your project structure

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('trigger')
  async triggerBackup() {
    try {
      const backupPath = await this.backupService.createBackup();
      return {
        message: 'Backup triggered successfully',
        path: backupPath,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Backup failed:', error);
      throw new HttpException(
        {
          message: 'Backup failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
