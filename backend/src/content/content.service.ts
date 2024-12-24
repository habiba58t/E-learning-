import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { Model } from 'mongoose';
import { Content } from './content.schema';
import { contentDocument } from './content.schema';
import { CreateContentDto} from './dto/CreateContent.dto';
import { Module} from 'src/modules/modules.schema';
import { moduleDocument } from 'src/modules/modules.schema';
import { ModulesService } from 'src/modules/modules.service';

@Injectable()
export class ContentService {

    constructor(
        @InjectModel(Content.name) private readonly contentModel: Model<contentDocument>, 
         @InjectModel(Module.name) private readonly moduleModel: Model<moduleDocument>,
         @Inject(forwardRef(() => ModulesService)) private readonly modulesService: ModulesService,){}

  //get content by objectId
  async findById(ObjectId: mongoose.Types.ObjectId): Promise<Content> {
    const content = await this.contentModel.findById(ObjectId).exec();
    if (!content) {
      throw new NotFoundException(`content with Object id ${ObjectId} not found`);
    }
    return content;
  }


  //toggle notes enable
async toggle(objectId: mongoose.Types.ObjectId ): Promise<void> {
  const content = await this.contentModel.findById(objectId);
  content.isOutdated = !content.isOutdated;
   await content.save();

}

  // Create a new content
async createContent(createContentDto: CreateContentDto): Promise<contentDocument> {
    const newContent = new this.contentModel(createContentDto);
    newContent.isOutdated = false;
    return await newContent.save();
  }

  // DELETE /modules/:title: Delete a module by its title
  async delete( objectId: mongoose.Types.ObjectId ,title: string): Promise<void> {
    const module = await this.modulesService.findByTitle(title);
    const content = await this.contentModel.findById(objectId) ;
    if (!content) {
      throw new Error(`Content with id "${objectId}" not found.`);
    }
  
    if (!module) {
      throw new Error(`Module with title "${title}" not found.`);
    }
  
    module.content = module.content.filter((id) => !id.equals(content._id));
    await module.save();

    await this.contentModel.findByIdAndDelete(objectId);
  }


}