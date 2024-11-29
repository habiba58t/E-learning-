import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class UpdateModuleDto {
    readonly content?: string;
    readonly resources?: string[];
    readonly level?: string;
    readonly status?: number;
    readonly  Question?: mongoose.Schema.Types.ObjectId[];
    readonly  Quiz?: mongoose.Schema.Types.ObjectId[];
    readonly  Note?: mongoose.Schema.Types.ObjectId[];
    readonly  totalRating?:number;
    readonly  totalStudents?:number;
    readonly  isOutdated?: boolean;
  }