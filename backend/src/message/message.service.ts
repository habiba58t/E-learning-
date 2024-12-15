import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { Message } from './message.schema';
import { MessageDocument } from './message.schema';
import { Model } from 'mongoose';

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
}
