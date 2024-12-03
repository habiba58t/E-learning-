// src/communication/chat/chat.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Get messages based on chat type
  @Get()
  getMessages(@Query('userId') userId: string, @Query('chatType') chatType: 'one-to-one' | 'group', @Query('recipientId') recipientId?: string, @Query('groupId') groupId?: string) {
    return this.chatService.getMessages(userId, chatType, recipientId, groupId);
  }

  // Add a message
  @Post()
  async addMessage(@Body() body: { message: string; userId: string; chatType: 'one-to-one' | 'group'; recipientId?: string; groupId?: string }) {
    const newMessage = await this.chatService.saveMessage(body.message, body.userId, body.chatType, body.recipientId, body.groupId);
    return { message: 'Message added successfully', data: newMessage };
  }
}
