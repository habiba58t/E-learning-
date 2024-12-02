// src/communication/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatSchema } from './chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),  // Register schema
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],  // Add ChatService and ChatGateway to providers
})
export class ChatModule {}
