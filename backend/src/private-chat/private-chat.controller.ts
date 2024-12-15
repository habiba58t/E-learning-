// import { Controller } from '@nestjs/common';

// @Controller('private-chat')
// export class PrivateChatController {}
import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { PrivateChatService } from './private-chat.service'; // Adjust the path based on your project structure
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';

@Controller('private-chat')
export class PrivateChatController {
  constructor(private readonly privateChatService: PrivateChatService) {}

  // Create a private chat between two users
  // Create a private chat between two users
  @Post('/create/:member1/:member2')
  async createPrivateChat(
    @Param('member1') member1: string,  // Retrieve member1 from the URL path
    @Param('member2') member2: string   // Retrieve member2 from the URL path
  ) {
    try {
      const chat = await this.privateChatService.createPrivateChat(member1, member2);
      return chat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Add a message to a private chat
  @Post('/:chatId/message')
  async addMessageToPrivateChat(
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const updatedChat = await this.privateChatService.addMessageToPrivateChat(chatId, createMessageDto);
      return updatedChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Fetch all messages for a private chat
  @Get('/:chatId/messages')
  async getPrivateChatMessages(@Param('chatId') chatId: string) {
    try {
      const privateChat = await this.privateChatService.getPrivateChatMessages(chatId);
      return privateChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Fetch a private chat by its ID
  @Get('/:chatId')
  async getPrivateChatById(@Param('chatId') chatId: string) {
    try {
      const privateChat = await this.privateChatService.getPrivateChatById(chatId);
      return privateChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Add a user to a private chat
  @Post('/:chatId/add-user')
  async addUserToPrivateChat(
    @Param('chatId') chatId: string,
    @Body('username') username: string,
  ) {
    try {
      const updatedChat = await this.privateChatService.addUserToPrivateChat(chatId, username);
      return updatedChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Get all private chats a user is a member of
  @Get('/user/:username')
  async getPrivateChatsForUser(@Param('username') username: string) {
    try {
      const chats = await this.privateChatService.getChatsByUser(username);
      return chats;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

