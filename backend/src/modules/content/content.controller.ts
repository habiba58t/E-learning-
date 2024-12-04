import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException  } from '@nestjs/common';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { ContentService } from './content.service';
import { Content } from './content.schema';
import { contentDocument } from './content.schema';
import { CreateContentDto } from './dto/CreateContent.dto';

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) {}
    @Get('id/:ObjectId')
    async findById(@Param('ObjectId') ObjectId: mongoose.Schema.Types.ObjectId): Promise<Content> {
      return this.contentService.findById(ObjectId);
    }

// POST /content: Create a new content
 @Post()
 async create(@Body() createContentDto: CreateContentDto): Promise<contentDocument> {
  return await this.contentService.createContent(createContentDto);
 }


}
