import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private backupPath: string = './backups/files';  // Hardcoded backup path
  private mongoUri: string = 'mongodb+srv://projectdb:12345@e-learning.6bu6g.mongodb.net/E-learning-';  // Hardcoded Mongo URI

  async createBackup(): Promise<string> {
    if (!this.mongoUri) {
      throw new Error('MongoDB URI is not defined');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.backupPath, `backup-${timestamp}`);
    const command = `"C:\\Program Files\\MongoDB\\Tools\\100\\bin\\mongodump" --uri="mongodb+srv://projectdb:12345@e-learning.6bu6g.mongodb.net/E-learning-" --out="${backupDir}"`;

    try {
      console.log(`Running command: ${command}`);
      const { stdout, stderr } = await execAsync(command);
      console.log('Backup successful:', stdout);
      if (stderr) console.warn('Backup warnings:', stderr);

      return backupDir;
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error(`Failed to create backup. Error: ${error.message}`);
    }
  }
}
