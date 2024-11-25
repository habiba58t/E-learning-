import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class CreateCourseDto {
    readonly course_code: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly difficulty_level: string;
    readonly created_by: string;
    readonly created_at: Date;
    readonly  modules: mongoose.Schema.Types.ObjectId[];
  }