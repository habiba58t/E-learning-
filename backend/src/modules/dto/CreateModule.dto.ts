import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class CreateModuleDto {
    readonly title: string;
    readonly content: string;
    readonly resources: string[];
    readonly level: string;
    readonly status: number;
    readonly  Question: mongoose.Schema.Types.ObjectId[];
    readonly  Quiz: mongoose.Schema.Types.ObjectId[]=[];
    readonly  Note: mongoose.Schema.Types.ObjectId[]=[];
    readonly  totalRating:number=0;
    readonly  totalStudents:number=0;
    readonly  isOutdated: boolean=false;
  }