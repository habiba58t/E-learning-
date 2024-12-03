// src/communication/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<ChatMessage>,
  ) {}

  // Save a message to the database
  async saveMessage(message: string, userId: string, recipientId: string): Promise<ChatMessage> {
    const newMessage = new this.chatModel({
      message,
      userId,
      recipientId,
    });
    return newMessage.save();  
  }

  // Get all messages for a user
  async getMessages(userId: string, recipientId: string): Promise<ChatMessage[]> {
    return this.chatModel.find({
      $or: [
        { userId, recipientId },
        { userId: recipientId, recipientId: userId },
      ],
    }).sort({ timestamp: 1 }).exec();  // Sort by timestamp ascending
  }
}
