import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ModulesService } from 'src/modules/modules.service';
import { ModulesController } from 'src/modules/modules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from './courses.schema';
import { ModulesModule } from '../modules/modules.module'; 
import { ModuleSchema } from '../modules/modules.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]), // Ensure this is imported here too
  ],

  providers: [CoursesService,ModulesService],
  controllers: [CoursesController],
  exports:[CoursesService,ModulesService]
})
export class CoursesModule {}
