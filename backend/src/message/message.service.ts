import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { Message } from './message.schema';
import { MessageDocument } from './message.schema';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/CreateMessage.dto';

@Injectable()
export class MessageService {
     constructor(
           // @InjectModel(Module.name) private moduleModel: Model<Module>,
            @InjectModel(Message.name) private readonly message: Model<MessageDocument>
        ){}

        async createMessage(createMessageDto: { content: string; sentBy: string }): Promise<MessageDocument> {
            const newMessage = new this.message(createMessageDto);
            return newMessage.save();
          }

          async createMessage2(messageDto: CreateMessageDto): Promise<MessageDocument> {
            const { content, sentBy } = messageDto;
            const sentAt = Date.now();
            const newMessage = new this.message({
              content,
              sentBy,
              sentAt,
            });
            return newMessage.save();
          }
}