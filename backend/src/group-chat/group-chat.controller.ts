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

    @Post('/:group_id/message')
  async sendGroupMessage(
    @Param('group_id') group_id: string,
    @Body() createMessageDto:CreateMessageDto 
  ) {
    return await this.groupchatService.addMessageToGroup(group_id,createMessageDto);
  }

  // Fetch all messages for a group chat
  @Get('/:group_id/messages')
  async getGroupMessages(@Param('group_id') groupId: string) {
      return await this.groupchatService.getGroupMessages(groupId);
  }
// Fetch a specific group chat by ID
@Get('/:group_id')
async getGroupById(@Param('group_id') groupId: string) {
    return await this.groupchatService.getGroupById(groupId);
}

// get groupchat bu course_code
@Get('/course/:courseCode')
async getGroupChatsByCourseCode(@Param('courseCode') courseCode: string): Promise<GroupDocument[]> {
    return await this.groupchatService.getGroupChatsByCourseCode(courseCode);
}
}
