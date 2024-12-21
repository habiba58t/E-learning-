import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException,UseGuards  } from '@nestjs/common';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { ContentService } from './content.service';
import { Content } from './content.schema';
import { contentDocument } from './content.schema';
import { CreateContentDto } from './dto/CreateContent.dto';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';


@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) {}
    @Get('id/:ObjectId')
    async findById(@Param('ObjectId') ObjectId: mongoose.Types.ObjectId): Promise<Content> {
      return this.contentService.findById(ObjectId);
    }

// POST /content: Create a new content
 @Post()
 async create(@Body() createContentDto: CreateContentDto): Promise<contentDocument> {
  return await this.contentService.createContent(createContentDto);
 }

// DELETE content
@UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Delete(':ObjectId/:title/deleteContent')
async delete(@Param('ObjectId') ObjectId: string,@Param('title') title: string): Promise<void> {
  const objectId = new mongoose.Types.ObjectId(ObjectId);
  return this.contentService.delete(objectId,title);
}


}