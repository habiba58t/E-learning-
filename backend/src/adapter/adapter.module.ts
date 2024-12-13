import { Module } from '@nestjs/common';
import { MongoToExcelAdapter } from './mongo-to-excel.adapter'; // Import your adapter here

@Module({
  providers: [MongoToExcelAdapter],
  exports: [MongoToExcelAdapter],  // Export the adapter to make it available in other modules
})
export class AdapterModule {}
