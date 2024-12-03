// src/communication/chat/chat.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Get all messages between two users
  @Get()
  getMessages(@Query('userId') userId: string, @Query('recipientId') recipientId: string) {
    return this.chatService.getMessages(userId, recipientId);
  }

  // Add a message
  @Post()
  async addMessage(@Body() body: { message: string; userId: string; recipientId: string }) {
    const newMessage = await this.chatService.saveMessage(body.message, body.userId, body.recipientId);
    return { message: 'Message added successfully', data: newMessage };
  }
}
