import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatMessage, ChatMessageSchema } from './chat.schema'; // Import ChatMessage schema
import { Group, GroupSchema } from './group.schema'; // Import Group schema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema }, // Register ChatMessage schema
      { name: Group.name, schema: GroupSchema }, // Register Group schema
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway], // Add ChatService and ChatGateway to providers
})
export class ChatModule {}
