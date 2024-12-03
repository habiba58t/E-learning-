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
  async saveMessage(message: string, userId: string, chatType: 'one-to-one' | 'group', recipientId?: string, groupId?: string): Promise<ChatMessage> {
    const newMessage = new this.chatModel({
      message,
      userId,
      chatType,
      recipientId,
      groupId,
    });
    return newMessage.save();  
  }

  // Get messages based on chat type
  async getMessages(userId: string, chatType: 'one-to-one' | 'group', recipientId?: string, groupId?: string): Promise<ChatMessage[]> {
    if (chatType === 'one-to-one') {
      return this.chatModel.find({
        $or: [
          { userId, recipientId },
          { userId: recipientId, recipientId: userId },
        ],
      }).sort({ timestamp: 1 }).exec();
    } else {
      return this.chatModel.find({ groupId }).sort({ timestamp: 1 }).exec();
    }
  }
}
