import { Injectable, NotFoundException, Inject, forwardRef ,InternalServerErrorException} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notes } from './notes.schema';  
import { HydratedDocument } from 'mongoose';
import { notesDocument } from './notes.schema';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { UsersModule } from 'src/users/users.module';
import {userDocument} from 'src/users/users.schema';
import { Users } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { moduleDocument } from 'src/modules/modules.schema';
import { ModulesService } from 'src/modules/modules.service';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private readonly noteModel: Model<notesDocument>,
  @InjectModel(Notes.name) private readonly moduleModel: Model<moduleDocument>,
   @Inject(forwardRef(() => ModulesService)) private readonly moduleService: ModulesService
  
) 
  {}
// Retrieve all notes
async findAll(): Promise<Notes[]> {
    return await this.noteModel.find().exec();
  }
  //GET NOTE BY OBJECT ID
  async findByIdNote(noteId: string): Promise<notesDocument> {
    const id = new mongoose.Types.ObjectId(noteId)
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with Object ID ${noteId} not found`);
    }
    return note;
  }
  // //GET NOTES by usernmae,coursecode,last updated
   async findNotebyUsername(username: string): Promise<notesDocument[]> {
     return await this.noteModel.findOne({username});

   }

  // Create a new note
  // async createNote(createNoteDto: CreateNoteDto): Promise<notesDocument> {
  //   const newNote = new this.noteModel(createNoteDto);
  //   newNote.createdAt=new Date();
  //   newNote.lastUpdated=new Date();
  //   return newNote.save();
  // }

  async createNote(
    createNoteDto: CreateNoteDto,
    module_title: string,
  ): Promise<notesDocument> {
    
    // Create the note

  const module = await this.moduleService.findByTitle(module_title)
    // Add the note to the module's notes array
    
    if (!module) {
      throw new 
      Error(`Module with ID ${module_title} not found`);
    }
    if(!module.enableNotes){
      throw new 
      Error('notes for this module are enabled')
    }

    const newNote = new this.noteModel(createNoteDto);
    newNote.createdAt = new Date();
    newNote.lastUpdated = new Date();

    // Save the note
    const savedNote = await newNote.save();
    module.notes.push(savedNote._id);

    // Save the updated module
    await module.save();
  
    return savedNote;

  }


  //DELETE a note by object id
  async deleteNote(noteId: mongoose.Types.ObjectId, module_title: string){
     //await this.noteModel.findByIdAndDelete(noteId).exec();
     const module = await this.moduleService.findByTitle(module_title)
    
      // Remove the note ID from the array of notes in the module
  module.notes = module.notes.filter(
    (id: mongoose.Types.ObjectId) => !id.equals(noteId)
  );
  await this.noteModel.findByIdAndDelete(noteId).exec();

  // Save the updated module
  await module.save();


  }

  //DELETE NOTE by username
  async deleteNoteByUsername(username:string) {
     await this.noteModel.findOneAndDelete({username});
  }

  // Update an existing note
  async updateNote(noteId: mongoose.Types.ObjectId, updateNoteDto: UpdateNoteDto): Promise<notesDocument> {
    const note= await this.noteModel.findByIdAndUpdate(noteId, updateNoteDto).exec();
    if(!note){
      return;
    }
    note.lastUpdated = new Date();
    await note.save();
    return note;
  }

}