import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { InstructorModule } from './instructor/instructor.module';
import { StudentModule } from './student/student.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [InstructorModule, StudentModule]
})
export class UsersModule {}
