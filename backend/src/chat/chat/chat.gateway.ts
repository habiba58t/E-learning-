// src/communication/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { NotificationService } from '/Users/ialiaaah/Documents/swwwww/swww/E-learning-/backend/src/notification/notification/notification.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly notificationService: NotificationService,
  ) {}

  @WebSocketServer() server: Server;
  private activeUsers = new Map<string, string>(); // Maps usernames to socket IDs

  handleConnection(client: Socket) {
    const userName = client.handshake.query.userName as string;
    if (userName) {
      this.activeUsers.set(userName, client.id); // Map username to socket ID
      console.log(`${userName} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    const userName = [...this.activeUsers.entries()].find(
      ([_, socketId]) => socketId === client.id,
    )?.[0];
    if (userName) {
      this.activeUsers.delete(userName); // Remove user from active users
      console.log(`${userName} disconnected`);
    }
  }

  // Send message event
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    message: {
      message: string;
      userName: string;
      chatType: 'one-to-one' | 'group';
      recipientUsername?: string;
      groupName?: string;
    },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const savedMessage = await this.chatService.saveMessage(
      message.message,
      message.userName,
      message.chatType,
      message.recipientUsername,
      message.groupName,
    );

    if (message.chatType === 'group') {
      const groupMembers = await this.chatService.getGroupMessages(message.groupName);
      groupMembers.forEach(async (memberUsername) => {
        if (memberUsername !== message.userName) {
          const socketId = this.activeUsers.get(memberUsername);
          if (socketId) {
            this.server.to(socketId).emit('receive_message', savedMessage);
          }
        }
      });
    } else {
      const recipientSocketId = this.activeUsers.get(message.recipientUsername);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('receive_message', savedMessage);
      }
    }
  }
}
