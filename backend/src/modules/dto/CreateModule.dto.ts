import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class CreateModuleDto {
    readonly title: string;
    readonly content:mongoose.Schema.Types.ObjectId[]=[];
    readonly level: string;
    readonly  Question: mongoose.Schema.Types.ObjectId[];
    readonly  Quiz: mongoose.Schema.Types.ObjectId[]=[];
    readonly  Note: mongoose.Schema.Types.ObjectId[]=[];
  }