
import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { PrivateChatService } from './private-chat.service'; // Adjust the path based on your project structure
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';
import { privatechatDocument } from './private-chat.schema';

@Controller('private-chat')
export class PrivateChatController {
  constructor(private readonly privateChatService: PrivateChatService) {}

  // Create a private chat between two users
  // Create a private chat between two users



//in home page for student searching for student redirects to profile which has a button to message that student
//when u click on message you will be redirected to chat page in side bar with all chat on the left and the real time chat with that person on
//the left with loaded messages in order of sent_by, the members usernames showing, message bubbles, and place to send text

//1- button 'message': create chat adding both users to members list and notifying the other user of the chat
// -createPrivateChat 
//->whether chat exists or not it will be called
//2- user is redirected to that chat, and getPrivateChatMessages is called to retrieve previous messages, if exists
//the chat will be on the right with getPrivateChatMessages called in useEffect to fetch new messages simulating real time
//on the left the users sees all his chats with getPrivateChatsForUser and clicking on any of them redirects the 
//user to that chat using dynamic routing
//3- user write a text and clicks send: addMessageToPrivateChat called which creates a message and adds it message[] of this
//chat to be loaded real time to both users
//4-each user sees themself on the right side of the chat which is by using member1, member 2, messages having sent_by, and token username
  @Post('/create/:member1/:member2')
  async createPrivateChat(
    @Param('member1') member1: string,  // Retrieve member1 from the URL path
    @Param('member2') member2: string   // Retrieve member2 from the URL path
  ) {
    try {
      const chat = await this.privateChatService.createPrivateChat(member1, member2);
      return chat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('/:chatId/message')
  async addMessageToPrivateChat(
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const updatedChat = await this.privateChatService.addMessageToPrivateChat(chatId, createMessageDto);
      return updatedChat;
    } catch (error) {
      // You can customize the error handling as per your use case
      throw new NotFoundException(error.message);
    }
  }
  
  // Fetch all messages for a private chat
  @Get('/:chatId/messages')
  async getPrivateChatMessages(@Param('chatId') chatId: string) {
    try {
      const privateChat = await this.privateChatService.getPrivateChatMessages(chatId);
      return privateChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  //Fetch chat between 2 members with all its messages
  @Get('/get-chat/:member1/:member2')
  async getPrivateChatWithMemberUsernames(@Param('member1') member1: string, @Param('member2') member2: string):
  Promise<privatechatDocument> {
    try {
      const privateChat = await this.privateChatService.getPrivateChatWithMemberUsernames(member1, member2);
      return privateChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


  // Fetch a private chat by its ID
  @Get('/:chatId')
  async getPrivateChatById(@Param('chatId') chatId: string) {
    try {
      const privateChat = await this.privateChatService.getPrivateChatById(chatId);
      return privateChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Add a user to a private chat, no usage for this, its group chat related
  @Post('/:chatId/add-user')
  async addUserToPrivateChat(
    @Param('chatId') chatId: string,
    @Body('username') username: string,
  ) {
    try {
      const updatedChat = await this.privateChatService.addUserToPrivateChat(chatId, username);
      return updatedChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Get all private chats a user is a member of
  @Get('/user/:username')
  async getPrivateChatsForUser(@Param('username') username: string):Promise<privatechatDocument[]> {
    try {
      const chats = await this.privateChatService.getChatsByUser(username);
      return chats;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
