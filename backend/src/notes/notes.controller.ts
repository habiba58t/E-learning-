/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './notes.schema';
import { AuthGuard } from './auth.guard';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('/getAll')
  async getAllNotes(): Promise<Note[]> {
    return await this.notesService.findAll();
  }

  @Post()
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.notesService.create(createNoteDto);
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string): Promise<Note> {
    return await this.notesService.remove(id);
  }

  @Patch(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return await this.notesService.update(id, updateNoteDto);
  }
}
