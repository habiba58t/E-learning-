import { forwardRef, Inject, Injectable,NotFoundException } from '@nestjs/common';
import { GroupChat } from './group-chat.schema';
import { Model } from 'mongoose';
import { GroupDocument } from './group-chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MessageService } from 'src/message/message.service';
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';
import { MessageDocument } from 'src/message/message.schema';
import { NotificationService } from 'src/notification/notification.service';
import { Message } from 'src/message/message.schema';
@Injectable()
export class GroupChatService {
    constructor(
       // @InjectModel(Module.name) private moduleModel: Model<Module>,
        @InjectModel(GroupChat.name) private readonly groupChat: Model<GroupDocument>,
        @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
         @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
         @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
    ){}
 // create group chat
    async createGroupChat(course_code: string, group_name: string, createdBy: string) {
        const newGroup = new this.groupChat({ course_code, group_name, createdBy, members: [createdBy] });

        // notify all users in the course 
       
        return newGroup.save();
        
        
      }


 // send message too the group chat
      async addMessageToGroup(groupName: string, createMessageDto: CreateMessageDto) :Promise<GroupDocument>{
        const message = await this.messageService.createMessage(createMessageDto)
        const group = await this.groupChat.findOne({group_name: groupName})
        if (!group) {
            throw new 
            Error(`Module with ID ${groupName} not found`);
          }
          group.messages.push(message._id);
      
          // Save the updated module
          await group.save();
        
          return group;
          // notify the user of a new message 
      }

 // fetch all messages of a group
 async getGroupMessages(groupName: string): Promise<GroupDocument> {
    const groupChat = await this.groupChat.findOne({ group_name: groupName }).populate('messages');
  
    if (!groupChat) {
      throw new NotFoundException(`Group with name "${groupName}" not found`);
    }
  
    return groupChat;
  }
 // fetch a group by its id 
    async getGroupById(groupId: string): Promise<GroupDocument> {
        const groupChat = await this.groupChat.findById(groupId);
        if (!groupChat) {
            throw new NotFoundException(`Group with ID ${groupId} not found`);
        }
        return groupChat;
    }

     // get groupchats  by course_code
    async getGroupChatsByCourseCode(courseCode: string): Promise<GroupDocument[]> {
        //const groupChats = await this.groupChat.find({ courseCode }).exec();
        const groupChats = await this.groupChat.find({ course_code: courseCode }).exec();
    
        if (!groupChats || groupChats.length === 0) {
            throw new NotFoundException(`No group chats found for course code ${courseCode}`);
        }
    
        return groupChats;
    }

    // Add user to the group chat
    async addUserToGroup(groupId: string, username: string): Promise<GroupChat> {
        const groupChat = await this.groupChat.findById(groupId);
        if (!groupChat) {
            throw new Error('Group chat not found');
        }

        // Check if the username is already in the group
        if (groupChat.members.includes(username)) {
            throw new Error('User is already in the group');
        }

        // Add the username to the group chat
        groupChat.members.push(username);

        // Save the updated group chat
        return await groupChat.save();
    }







}
