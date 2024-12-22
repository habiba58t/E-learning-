import { Body, Controller, Param, Post, Get, Delete ,UseGuards, Put} from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';
import { GroupDocument } from './group-chat.schema';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

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
@Get('/:groupName')
async getGroupById(@Param('groupName') groupName: string):Promise<GroupDocument>{
    return await this.groupchatService.getGroupById(groupName);
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

   @UseGuards(AuthGuard, AuthorizationGuard)
   @Roles(Role.Admin, Role.Instructor,Role.User)
  @Delete('/:groupName/:username/:course_code/delete')
  async deletegroup( 
  @Param('groupName') groupName: string, // Extract groupName from the URL param
  @Param('username') username: string,
  @Param('course_code') course_code:string ): Promise<GroupDocument>{
    try{
      const deletedGroupChat = await this.groupchatService.deleteChat(groupName,username,course_code);
      return deletedGroupChat;
    } catch(error){
      throw new Error(error.message)
    }
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor,Role.User)
  @Post('/:groupName/:username/:course_code/exit')
  async exitgroup(
  @Param('groupName') groupName: string, // Extract groupName from the URL param
  @Param('username') username: string,
  @Param('course_code') course_code:string ): Promise<GroupDocument>{
    try{
      const chat = await this.groupchatService.exitChat(groupName,username,course_code);
      return chat;
    }catch(error){
      throw new Error(error.message)
    }
  }

    
}