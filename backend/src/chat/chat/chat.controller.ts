// src/communication/chat/chat.controller.ts
import { Controller, Get, Post, Body, Query, Param, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { NotificationService } from '/Users/ialiaaah/Documents/swwwww/swww/E-learning-/backend/src/notification/notification/notification.service'
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly notificationService: NotificationService,
  ) {}

  // Add a message (no membership checks for open groups)
  @Post()
  async addMessage(
    @Body() body: {
      message: string;
      userName: string;
      chatType: 'one-to-one' | 'group';
      recipientUsername?: string;
      groupName?: string;
    },
  ) {
    const newMessage = await this.chatService.saveMessage(
      body.message,
      body.userName,
      body.chatType,
      body.recipientUsername,
      body.groupName,
    );

    if (body.chatType === 'group') {
      const groupMembers = await this.chatService.getGroupMessages(body.groupName);
      groupMembers.forEach(async (memberUsername) => {
        if (memberUsername !== body.userName) {
          await this.notificationService.createNotification(
            `${body.userName} sent a message in the group "${body.groupName}".`,
            memberUsername,
          );
        }
      });
    } else if (body.chatType === 'one-to-one') {
      await this.notificationService.createNotification(
        `${body.userName} sent you a message.`,
        body.recipientUsername,
      );
    }

    return { message: 'Message added successfully', data: newMessage };
  }

  // Join a group
  @Post('group/:groupName/join')
  async joinGroup(@Param('groupName') groupName: string, @Body() body: { userName: string }) {
    const updatedGroup = await this.chatService.joinGroup(groupName, body.userName);

    await this.notificationService.createNotification(
      `${body.userName} joined your group "${groupName}".`,
      updatedGroup.adminUsername,
    );

    return { message: `You have joined the group "${groupName}".`, data: updatedGroup };
  }

  // Create a group
  @Post('group')
  async createGroup(@Body() body: { name: string; adminUsername: string }) {
    const newGroup = await this.chatService.createGroup(body.name, body.adminUsername);

    await this.notificationService.createNotification(
      `You have created the group "${body.name}".`,
      body.adminUsername,
    );

    return { message: 'Group created successfully', data: newGroup };
  }

  // Add a member to a group
  @Patch('group/:groupName/add-member')
  async addMember(@Param('groupName') groupName: string, @Body() body: { username: string }) {
    const updatedGroup = await this.chatService.addMember(groupName, body.username);

    await this.notificationService.createNotification(
      `You have been added to the group "${groupName}".`,
      body.username,
    );

    return { message: 'Member added successfully', data: updatedGroup };
  }

  // Remove a member from a group
  @Patch('group/:groupName/remove-member')
  async removeMember(@Param('groupName') groupName: string, @Body() body: { username: string }) {
    const updatedGroup = await this.chatService.removeMember(groupName, body.username);

    await this.notificationService.createNotification(
      `You have been removed from the group "${groupName}".`,
      body.username,
    );

    return { message: 'Member removed successfully', data: updatedGroup };
  }

  // Get messages for a group
  @Get('group/:groupName/messages')
  async getGroupMessages(@Param('groupName') groupName: string) {
    const messages = await this.chatService.getGroupMessages(groupName);
    return { message: 'Messages retrieved successfully', data: messages };
  }
}
