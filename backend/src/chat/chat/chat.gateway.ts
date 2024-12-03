// src/communication/chat/chat.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;  

  // Listen for the 'send_message' event from the client
  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() message: { message: string; userId: string; recipientId: string }, @ConnectedSocket() client: Socket): Promise<void> {
    // Save the message to the database
    const savedMessage = await this.chatService.saveMessage(message.message, message.userId, message.recipientId);

    // Send the message to the recipient only
    const recipientSocketId = this.getRecipientSocketId(message.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receive_message', savedMessage);
    }
  }

  // Get all messages between two users
  @SubscribeMessage('get_messages')
  async getMessages(@MessageBody() data: { userId: string; recipientId: string }): Promise<void> {
    const messages = await this.chatService.getMessages(data.userId, data.recipientId);
    const clientSocketId = this.getRecipientSocketId(data.userId);
    this.server.to(clientSocketId).emit('receive_messages', messages);
  }

  // Helper function to get the recipient's socket ID
  getRecipientSocketId(userId: string): string | undefined {
    const clients = this.server.sockets.sockets;
    for (const client of clients.values()) {
      if (client.handshake.query.userId === userId) {
        return client.id;
      }
    }
    return undefined;
  }
}
