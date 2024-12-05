// src/communication/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat.schema';
import { Group } from './group.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<ChatMessage>,
    @InjectModel('Group') private readonly groupModel: Model<Group>,
  ) {}

  // Save a message to the database for both one-to-one and group chats
  async saveMessage(
    message: string,
    userName: string,
    chatType: 'one-to-one' | 'group',
    recipientUsername?: string,
    groupName?: string,
  ): Promise<ChatMessage> {
    let groupId: string | undefined;

    if (chatType === 'group') {
      const group = await this.groupModel.findOne({ name: groupName });
      if (!group) throw new Error('Group not found');
      groupId = group._id.toString(); // Get group ID for group messages
    }

    const newMessage = new this.chatModel({
      message,
      userName,
      chatType,
      recipientUsername,
      groupId,
    });

    return newMessage.save(); // Save message to MongoDB
  }

  // Get messages based on chat type (one-to-one or group)
  async getMessages(
    userName: string,
    chatType: 'one-to-one' | 'group',
    recipientUsername?: string,
    groupName?: string,
  ): Promise<ChatMessage[]> {
    if (chatType === 'one-to-one') {
      return this.chatModel.find({
        $or: [
          { userName, recipientUsername },
          { userName: recipientUsername, recipientUsername: userName },
        ],
      }).sort({ timestamp: 1 }).exec();
    } else if (chatType === 'group') {
      const group = await this.groupModel.findOne({ name: groupName });
      if (!group) throw new Error('Group not found');
      return this.chatModel.find({ groupId: group._id.toString() }).sort({ timestamp: 1 }).exec();
    }
    return [];
  }

  // Get the list of group members based on group name
  async getGroupMessages(groupName: string): Promise<string[]> {
    const group = await this.groupModel.findOne({ name: groupName });
    if (!group) throw new Error('Group not found');
    
    // Return the list of member usernames
    return group.memberUsernames;
  }

  // Create a new group
  async createGroup(name: string, adminUsername: string): Promise<Group> {
    const newGroup = new this.groupModel({
      name,
      adminUsername,
      memberUsernames: [adminUsername], // Admin is added as the first member
    });
    return newGroup.save(); // Save group to the database
  }

  // Add a member to an existing group (allow anyone to join open groups)
  async joinGroup(groupName: string, userName: string): Promise<Group> {
    const group = await this.groupModel.findOne({ name: groupName });
    if (!group) throw new Error('Group not found');
    if (!group.isOpen) throw new Error('This group is restricted');

    // Add user to the group members if not already present
    if (!group.memberUsernames.includes(userName)) {
      group.memberUsernames.push(userName);
      await group.save();
    }

    return group;
  }

  // Add a member to a group
  async addMember(groupName: string, username: string): Promise<Group> {
    return this.groupModel.findOneAndUpdate(
      { name: groupName },
      { $addToSet: { memberUsernames: username } },
      { new: true },
    );
  }

  // Remove a member from a group
  async removeMember(groupName: string, username: string): Promise<Group> {
    return this.groupModel.findOneAndUpdate(
      { name: groupName },
      { $pull: { memberUsernames: username } },
      { new: true },
    );
  }
}
