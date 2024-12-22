import * as mongoose from 'mongoose';

export class CreateContentDto {
  readonly title: string;
  readonly resources: { filePath: string; fileType: string; originalName: string }[];  // Adjust resources to match the expected structure
}