import { forwardRef, Inject, Injectable,NotFoundException } from '@nestjs/common';
import { GroupChat } from './group-chat.schema';
import { Model } from 'mongoose';
import { GroupDocument } from '../group-chat/group-chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MessageService } from 'src/message/message.service';
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';
import { MessageDocument } from 'src/message/message.schema';
import { NotificationService } from 'src/notification/notification.service';
import { Message } from 'src/message/message.schema';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class GroupChatService {
    constructor(
       // @InjectModel(Module.name) private moduleModel: Model<Module>,
        @InjectModel(GroupChat.name) private readonly groupChat: Model<GroupDocument>,
        @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
         @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
         @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
         @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
         @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
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
    async addUserToGroup(group_name: string, username: string): Promise<GroupDocument> {
        const groupChat = await this.groupChat.findOne({group_name});
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

//delete chat only admin of group and instructor 

async deleteChat(groupName: string, username: string, course_code: string): Promise<GroupDocument> {
    // Fetch the group chat
    const groupChat = await this.groupChat.findOne({ group_name: groupName });
  
    if (!groupChat) {
      throw new Error('Group chat not found');
    }
  
    // Fetch the course to get the instructor
    const course = await this.coursesService.findOne(course_code);
  
    if (!course) {
      throw new Error('Course not found');
    }

  
    // Check authorization
    const isCreatedByUser = groupChat.createdBy === username;
    const isInstructor = course.created_by === username;
  
    if (!isCreatedByUser && !isInstructor) {
      throw new Error('You are not authorized to delete this group chat');
    }
  
    // Proceed with deletion
    const deletedGroupChat = await this.groupChat.findOneAndDelete({ group_name: groupName });
  
    if (!deletedGroupChat) {
      throw new Error('Failed to delete group chat');
    }
  
    return deletedGroupChat;
  }

  async exitChat(groupName: string, username: string, course_code: string):Promise<GroupDocument> {
    const chat = await this.groupChat.findOne({group_name: groupName})

    if (!chat) {
        throw new Error('Group not found');
      }

      if (!chat.members.includes(username)) {
        console.error('User is not a member');
        throw new Error('User is not a member of this group');
      }
      chat.members = chat.members.filter(member => member !== username);
      await chat.save();

      return chat;
  }
  






}