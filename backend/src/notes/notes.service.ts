/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './notes.schema';  

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  // Create a new note
  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const newNote = new this.noteModel(createNoteDto);
    return newNote.save();
  }

  // Retrieve all notes
  async findAll(): Promise<Note[]> {
    return await this.noteModel.find().exec();
  }

  // Retrieve a specific note by ID
  async findOne(id: string): Promise<Note> {
    return await this.noteModel.findById(id).exec();
  }

  // Update an existing note
  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    return await this.noteModel.findByIdAndUpdate(id, updateNoteDto, { new: true }).exec();
  }

  // Remove a note by ID
  async remove(id: string): Promise<Note> {
    return await this.noteModel.findByIdAndDelete(id).exec();
  }
}

