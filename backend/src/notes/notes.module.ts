import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { UsersSchema } from 'src/users/users.schema';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { NoteSchema } from './notes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]),



  ],
  providers: [NotesService, UsersService],
  controllers: [NotesController]
})
export class NotesModule {}



