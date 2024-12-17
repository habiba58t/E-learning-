
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Message } from './message.schema';
import { MessageDocument } from './message.schema';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/CreateMessage.dto';

@Controller('message')
export class MessageController {
      constructor(private readonly messageService: MessageService) {}

// Create a new message
 // Create a new message
 @Post()
 async createMessage(@Body() CreateMessageDto: { content: string; sentBy: string }): Promise<Message> {
   return this.messageService.createMessage(CreateMessageDto);
 }

 @Post()
  async createMessage2(@Body() messageDto: CreateMessageDto): Promise<Message> {
    return this.messageService.createMessage2(messageDto);
  }


}