import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
  providers: [AdminService, UsersService],
  controllers: [AdminController],
})
export class AdminModule {}
