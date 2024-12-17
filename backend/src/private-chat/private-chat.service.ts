// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class PrivateChatService {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrivateChat, PrivateChatSchema } from './private-chat.schema'; // Adjust the path based on your project structure
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';
import { MessageService } from 'src/message/message.service';
import { MessageDocument } from 'src/message/message.schema';
import { Message } from 'src/message/message.schema';
import { privatechatDocument } from './private-chat.schema';
import { NotificationService } from 'src/notification/notification.service';
@Injectable()
export class PrivateChatService {
  constructor(
    @InjectModel(PrivateChat.name) private readonly privateChatModel: Model<privatechatDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly messageService: MessageService,
    private readonly notifService: NotificationService
  ) {}

  // Create a new private chat between two users, member1 is the initiator member 2 receives a notification
  async createPrivateChat(member1: string, member2: string): Promise<PrivateChat> {
    // Ensure that a private chat between the users doesn't already exist
    const existingChat = await this.privateChatModel.findOne({
      $or: [
        { member1: member1, member2: member2 },
        { member1: member2, member2: member1 },
      ],
    });

    if (existingChat) {
        return existingChat;
      //if a chat exists, do nothing and return, if it doesnt create it
      //in front end both cases will redirect to the chat
    }

    // Create a new private chat
    const newChat = new this.privateChatModel({
      member1: member1,
      member2: member2,
    //  course_code: null, // No course associated with private chats
      Message: [], // Initially, no messages
    });
    await this.notifService.createPrivateChatNotification(member1, member2) //send to member2 that member1 initiates a chat
    return newChat.save();
  }

  async addMessageToPrivateChat(
    chatId: string,
    createMessageDto: CreateMessageDto,  // Accept the DTO here
  ): Promise<PrivateChat> {
    try {
      // Create the new message using the DTO
      const message = await this.messageService.createMessage2(createMessageDto);
  
      // Find the private chat by chatId and populate the 'Message' field
      const privateChat = await this.privateChatModel.findById(chatId)
        .populate('Message')  // Ensure 'Message' is populated correctly
        .exec();
  
      // Check if the private chat was found
      if (!privateChat) {
        throw new Error(`Private chat with ID ${chatId} not found`);
      }
  
      // Add the new message's ID to the chat's messages array
      privateChat.Message.push(message._id);
  
      // Save the updated private chat
      await privateChat.save();
  
      return privateChat;
    } catch (error) {
      throw new Error(error.message || 'An error occurred while adding the message to the private chat');
    }
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

  async getPrivateChatWithMemberUsernames(member1: string, member2: string) {
    try {
      const chat = await this.privateChatModel.findOne({
        $or: [
          { member1: member1, member2: member2 },
          { member1: member2, member2: member1 },
        ],
      })
      .populate('Message')
      .exec();    
      return chat;
    } catch (error) {
      throw new NotFoundException('Private chat not found');    
    }
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
    if (privateChat.member1 === username || privateChat.member2 === username) {
      throw new Error('User is already part of the private chat');
    }

    // If it's a private chat between two users, adding a new user is not possible, as the chat is between exactly two users.
    throw new Error('A private chat can only have exactly two members');
  }


  // Get all private chats a user is a member of
  async getChatsByUser(username: string): Promise<privatechatDocument[]> {
    const chats = await this.privateChatModel.find({
      $or: [{ member1: username }, { member2: username }],
    });

    if (!chats || chats.length === 0) {
      throw new NotFoundException(`No private chats found for user ${username}`);
    }

    return chats;
  }
}
