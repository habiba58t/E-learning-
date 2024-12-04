import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class UpdateCourseDto {
    readonly description?: string;
    readonly category?: string;
    readonly difficulty_level?: string;
    readonly  modules?: mongoose.Schema.Types.ObjectId[];
    readonly  totalRating?:number;
    readonly  totalStudents?:number;
    readonly  isOutdated?: boolean;
  }