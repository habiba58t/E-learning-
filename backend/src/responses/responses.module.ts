
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { Responses, ResponsesSchema } from './responses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema }]),
  ],
  providers: [ResponsesService],
  controllers: [ResponsesController],
})
export class ResponsesModule {}