// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class PrivateChatService {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrivateChat } from './private-chat.schema'; // Adjust the path based on your project structure
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';
import { MessageService } from 'src/message/message.service';
import { MessageDocument } from 'src/message/message.schema';
import { Message } from 'src/message/message.schema';

@Injectable()
export class PrivateChatService {
  constructor(
    @InjectModel(PrivateChat.name) private readonly privateChatModel: Model<PrivateChat>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly messageService: MessageService,
  ) {}

  // Create a new private chat between two users
  async createPrivateChat(member1: string, member2: string): Promise<PrivateChat> {
    // Ensure that a private chat between the users doesn't already exist
    const existingChat = await this.privateChatModel.findOne({
      $or: [
        { memeber1: member1, memeber2: member2 },
        { memeber1: member2, memeber2: member1 },
      ],
    });

    if (existingChat) {
      throw new Error('Private chat already exists between these two users');
    }

    // Create a new private chat
    const newChat = new this.privateChatModel({
      memeber1: member1,
      memeber2: member2,
      course_code: null, // No course associated with private chats
      Message: [], // Initially, no messages
    });

    return newChat.save();
  }

  // Add a message to the private chat
  async addMessageToPrivateChat(chatId: string, createMessageDto: CreateMessageDto): Promise<PrivateChat> {
    const message = await this.messageService.createMessage(createMessageDto);
    const privateChat = await this.privateChatModel.findById(chatId);

    if (!privateChat) {
      throw new Error(`Private chat with ID ${chatId} not found`);
    }

    privateChat.Message.push(message._id);
    await privateChat.save();

    // Optionally notify users (you can implement this logic based on your requirements)

    return privateChat;
  }

  // Get all messages in a private chat
  async getPrivateChatMessages(chatId: string): Promise<PrivateChat> {
    const privateChat = await this.privateChatModel
      .findById(chatId)
      .populate('Message'); // Populating the Message references to get full message details

    if (!privateChat) {
      throw new NotFoundException(`Private chat with ID ${chatId} not found`);
    }

    return privateChat;
  }

  // Fetch a private chat by its ID
  async getPrivateChatById(chatId: string): Promise<PrivateChat> {
    const privateChat = await this.privateChatModel.findById(chatId);

    if (!privateChat) {
      throw new NotFoundException(`Private chat with ID ${chatId} not found`);
    }

    return privateChat;
  }

  // Add a user to an existing private chat (if they are not already a member)
  async addUserToPrivateChat(chatId: string, username: string): Promise<PrivateChat> {
    const privateChat = await this.privateChatModel.findById(chatId);

    if (!privateChat) {
      throw new Error(`Private chat with ID ${chatId} not found`);
    }

    // Check if the user is already part of the chat
    if (privateChat.memeber1 === username || privateChat.memeber2 === username) {
      throw new Error('User is already part of the private chat');
    }

    // If it's a private chat between two users, adding a new user is not possible, as the chat is between exactly two users.
    throw new Error('A private chat can only have exactly two members');
  }


  // Get all private chats a user is a member of
  async getChatsByUser(username: string): Promise<PrivateChat[]> {
    const chats = await this.privateChatModel.find({
      $or: [{ memeber1: username }, { memeber2: username }],
    });

    if (!chats || chats.length === 0) {
      throw new NotFoundException(`No private chats found for user ${username}`);
    }

    return chats;
  }
}

