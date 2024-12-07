import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { Model } from 'mongoose';
import { Content } from './content.schema';
import { contentDocument } from './content.schema';
import { CreateContentDto} from './dto/CreateContent.dto';

@Injectable()
export class ContentService {

    constructor(
        @InjectModel(Content.name) private readonly contentModel: Model<contentDocument>,) {}

  //get content by objectId
  async findById(ObjectId: mongoose.Schema.Types.ObjectId): Promise<Content> {
    const content = await this.contentModel.findById(ObjectId).exec();
    if (!content) {
      throw new NotFoundException(`content with Object id ${ObjectId} not found`);
    }
    return content;
  }

  // Create a new content
async createContent(createContentDto: CreateContentDto): Promise<contentDocument> {
    const newContent = new this.contentModel(createContentDto);
    newContent.isOutdated = false;
    return await newContent.save();
  }

  


}
