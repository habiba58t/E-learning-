import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

export function ensureBackupDirectory() {
  const backupPath = path.join(__dirname, '..', '..', '..', 'backups', 'files');
  if (!existsSync(backupPath)) {
    mkdirSync(backupPath, { recursive: true });
    console.log(`Backup directory created: ${backupPath}`);
  }
  return backupPath;
}
