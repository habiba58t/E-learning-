
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;  

  // Listen for the 'send_message' event from the client
  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() message: { message: string; userId: string }): Promise<void> {
    // Save the message to the database
    const savedMessage = await this.chatService.saveMessage(message.message, message.userId);

    // send to all connected clients
    this.server.emit('receive_message', savedMessage);
  }

  //fetch all chats
  @SubscribeMessage('get_messages')
  async getMessages(@MessageBody() data: any): Promise<void> {
    const messages = await this.chatService.getMessages();
    this.server.emit('receive_messages', messages);  // send all ll client
  }
}
// one to one chat