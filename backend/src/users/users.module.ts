import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { InstructorModule } from './instructor/instructor.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [InstructorModule]
})
export class UsersModule {}
