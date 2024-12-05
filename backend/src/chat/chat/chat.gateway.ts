import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { NotificationService } from '/Users/ialiaaah/Documents/swwwww/swww/E-learning-/backend/src/notification/notification/notification.service'; // Import NotificationService
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly notificationService: NotificationService, // Inject NotificationService
  ) {}

  @WebSocketServer() server: Server;

  private activeUsers = new Map<string, string>(); // Maps usernames to socket IDs

  // Listen for the 'send_message' event from the client
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() message: {
      message: string;
      userName: string; // Changed from userId to userName
      chatType: 'one-to-one' | 'group';
      recipientUsername?: string; // Changed from recipientId to recipientUsername
      groupName?: string; // Changed from groupId to groupName
    },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    // Save the message to the database
    const savedMessage = await this.chatService.saveMessage(
      message.message,
      message.userName,
      message.chatType,
      message.recipientUsername,
      message.groupName
    );

    if (message.chatType === 'one-to-one') {
      // Send the message to the recipient only
      const recipientSocketId = this.getRecipientSocketId(message.recipientUsername);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('receive_message', savedMessage);

        // Send a notification to the recipient
        await this.notificationService.createNotification(
          `${message.userName} sent you a message.`,
          message.recipientUsername,
        );
      }
    } else if (message.chatType === 'group') {
      // Get the list of group members (usernames)
      const groupMembers = await this.chatService.getGroupMessages(message.groupName);

      // Send the message to all group members
      groupMembers.forEach(async (memberUsername) => {
        const socketId = this.getRecipientSocketId(memberUsername);
        if (socketId) {
          this.server.to(socketId).emit('receive_message', savedMessage);
        }

        // Send notification to each group member
        if (memberUsername !== message.userName) {
          await this.notificationService.createNotification(
            `${message.userName} sent a message in the group "${message.groupName}".`,
            memberUsername,
          );
        }
      });
    }
  }

  // Get messages based on chat type
  @SubscribeMessage('get_messages')
  async getMessages(
    @MessageBody() data: {
      userName: string; // Changed from userId to userName
      chatType: 'one-to-one' | 'group';
      recipientUsername?: string; // Changed from recipientId to recipientUsername
      groupName?: string; // Changed from groupId to groupName
    }
  ): Promise<void> {
    const messages = await this.chatService.getMessages(
      data.userName,
      data.chatType,
      data.recipientUsername,
      data.groupName
    );
    const clientSocketId = this.getRecipientSocketId(data.userName);
    if (clientSocketId) {
      this.server.to(clientSocketId).emit('receive_messages', messages);
    }
  }

  // Helper function to get the recipient's socket ID based on username
  getRecipientSocketId(userName: string): string | undefined {
    const socketId = this.activeUsers.get(userName); // Get socket ID based on userName
    return socketId; // If the user is connected, return their socket ID
  }
}
