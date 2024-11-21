import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHello(): string {
    return 'Hello World!';
  }

  checkDatabaseConnection(): string {
    if (this.connection.readyState === 1) {
      return 'Database is connected!';
    } else {
      return 'Database is not connected!';
    }
  }
}
