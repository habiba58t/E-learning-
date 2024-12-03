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

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private noteModel: Model<notesDocument>,
  @InjectModel(Users.name) private readonly userModel: Model<userDocument>,
  @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
) 
  {}
// Retrieve all notes
async findAll(): Promise<Notes[]> {
    return await this.noteModel.find().exec();
  }
  //GET NOTE BY OBJECT ID
  async findByIdNote(noteId: mongoose.Types.ObjectId): Promise<notesDocument> {
    const note = await this.noteModel.findById(noteId).exec();
    if (!note) {
      throw new NotFoundException(`Note with Object ID ${noteId} not found`);
    }
    return note;
  }
  // //GET NOTES by usernmae,coursecode,last updated
  // async findNote(username: string,course_code:string,lastUpdated:Date): Promise<notesDocument> {
  //   return await this.noteModel.findOne({username,course_code,lastUpdated});

  // }

  // Create a new note
  async createNote(createNoteDto: CreateNoteDto): Promise<notesDocument> {
    const newNote = new this.noteModel(createNoteDto);
    newNote.createdAt=new Date();
    newNote.lastUpdated=new Date();
    return newNote.save();
  }

  //DELETE a note by username,coursecode,last updated
  async deleteNote(noteId: mongoose.Types.ObjectId): Promise<notesDocument> {
    return await this.noteModel.findOneAndDelete({noteId}).exec();
  }

  // Update an existing note
  async updateNote(noteId: mongoose.Types.ObjectId, updateNoteDto: UpdateNoteDto): Promise<notesDocument> {
    const note= await this.noteModel.findOneAndUpdate({noteId}, updateNoteDto, { new: true }).exec();
    note.lastUpdated = new Date();
    await note.save();
    return note;
  }

}