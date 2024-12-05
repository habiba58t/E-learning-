import { Controller, Get, Post, Body, Query, Param, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { NotificationService } from '/Users/ialiaaah/Documents/swwwww/swww/E-learning-/backend/src/notification/notification/notification.service'; // Import NotificationService

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly notificationService: NotificationService,  // Inject NotificationService
  ) {}

  // Get messages based on chat type
  @Get()
  getMessages(
    @Query('userName') userName: string, 
    @Query('chatType') chatType: 'one-to-one' | 'group', 
    @Query('recipientUsername') recipientUsername?: string, 
    @Query('groupName') groupName?: string
  ) {
    return this.chatService.getMessages(userName, chatType, recipientUsername, groupName);
  }

  // Add a message (for both one-to-one and group)
  @Post()
  async addMessage(
    @Body() body: {
      message: string; 
      userName: string; // Changed to userName to use username instead of userId
      chatType: 'one-to-one' | 'group'; 
      recipientUsername?: string; // Changed to recipientUsername
      groupName?: string; // Changed to groupName
    }
  ) {
    const newMessage = await this.chatService.saveMessage(
      body.message, 
      body.userName, 
      body.chatType, 
      body.recipientUsername, 
      body.groupName
    );

    // Trigger notifications for the new message
    if (body.chatType === 'group') {
      // Notify all group members except the sender
      const groupMembers = await this.chatService.getGroupMessages(body.groupName);
      groupMembers.forEach(async (memberUsername) => {
        if (memberUsername !== body.userName) { // Avoid notifying the sender
          await this.notificationService.createNotification(
            `${body.userName} sent a new message in the group "${body.groupName}".`,
            memberUsername,
          );
        }
      });
    } else if (body.chatType === 'one-to-one') {
      // Notify the recipient of the one-to-one message
      await this.notificationService.createNotification(
        `${body.userName} sent you a message.`,
        body.recipientUsername,
      );
    }

    return { message: 'Message added successfully', data: newMessage };
  }

  // Create a group
  @Post('group')
  async createGroup(@Body() body: { name: string; adminUsername: string }) {
    const newGroup = await this.chatService.createGroup(body.name, body.adminUsername);

    // Notify the admin when a group is created
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

    // Notify the added member
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

    // Notify the removed member
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
