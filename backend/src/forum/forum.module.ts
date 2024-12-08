// src/communication/forum/forum.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';


@Module({
  imports: [
    MongooseModule.forFeature([]),  
  ],
  controllers: [ForumController],
  providers: [ForumService], 
})
export class ForumModule {}
