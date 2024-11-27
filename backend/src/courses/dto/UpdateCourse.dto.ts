import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class UpdateCourseDto {
     title?: string;
     description?: string;
     category?: string;
     difficulty_level?: string;
     created_by?: string;
    modules?: mongoose.Schema.Types.ObjectId[];
  }