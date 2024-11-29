import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Responses, ResponsesSchema } from './responses.schema';
import { Users, UsersSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Responses.name, schema: ResponsesSchema } , { name: Users.name, schema: UsersSchema },]),
  ],
  providers: [ResponsesService],
  controllers:[ResponsesController]
})
export class ResponsesModule {}
