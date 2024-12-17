import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';
import { GroupDocument } from './group-chat.schema';

@Controller('group-chat')
export class GroupChatController {
    constructor(private readonly groupchatService: GroupChatService) {}
// create a group chat
    @Post('/:course_code')
    async createGroupChat(
      @Param('course_code') course_code: string,
      @Body() { group_name, createdBy }: { group_name: string; createdBy: string }
    ) {
      return await this.groupchatService.createGroupChat(course_code, group_name, createdBy);
    }
 // send messsage to group chat

    @Post('/:group_name/message')
  async sendGroupMessage(
    @Param('group_name') group_name: string,
    @Body() createMessageDto:CreateMessageDto 
  ) {
    return await this.groupchatService.addMessageToGroup(group_name,createMessageDto);
  }

  // Fetch all messages for a group chat
  @Get('/:groupName/messages')
  async getGroupMessages(@Param('groupName') group_name: string):Promise<GroupDocument> {
      return await this.groupchatService.getGroupMessages(group_name);
  }
// Fetch a specific group chat by ID
@Get('/:group_id')
async getGroupById(@Param('group_id') groupId: string):Promise<GroupDocument>{
    return await this.groupchatService.getGroupById(groupId);
}

// get groupchat bu course_code
@Get('/course/:courseCode')
async getGroupChatsByCourseCode(@Param('courseCode') courseCode: string): Promise<GroupDocument[]> {
    return await this.groupchatService.getGroupChatsByCourseCode(courseCode);
}



@Post('/:groupName/add-user/:username')
  async addUserToGroup(
    @Param('groupName') groupName: string, // Extract groupName from the URL param
    @Param('username') username: string,  // Extract username from the URL param
  ): Promise<GroupDocument> {
    try {
      // Call service to add user to group
      const updatedGroupChat = await this.groupchatService.addUserToGroup(groupName, username);
      return updatedGroupChat;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
