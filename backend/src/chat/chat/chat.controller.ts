// src/communication/chat/chat.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  //get all messages
  @Get()
  getMessages() {
    return this.chatService.getMessages();
  }

  // add a message 
  @Post()
  async addMessage(@Body() body: { message: string; userId: string }) {
    const newMessage = await this.chatService.saveMessage(body.message, body.userId);
    return { message: 'Message added successfully', data: newMessage };
  }
}
