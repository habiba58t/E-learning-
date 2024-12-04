import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }

  
  
}
