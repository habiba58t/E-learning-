/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  // Import MongooseModule
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { NoteSchema } from './notes.schema';  // Import the Note schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),  // Register the Note schema
  ],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
