import { Module } from '@nestjs/common';
import { BackupService } from './services/backup.service';
import { BackupSchedulerService } from './tasks/backup-scheduler.service';
import { BackupController } from './controllers/backup.controller';

@Module({
  providers: [BackupService, BackupSchedulerService],
  controllers: [BackupController],
})
export class BackupModule {}
