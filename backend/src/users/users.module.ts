// import { Module } from '@nestjs/common';
// import { UsersController } from './users.controller';
// import { InstructorModule } from './instructor/instructor.module';
// import { StudentModule } from './student/student.module';
// import { UsersSchema } from './users.schema';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { AdminModule } from './admin/admin.module';
// import { CoursesSchema } from 'src/courses/courses.schema';
// import { CoursesService } from 'src/courses/courses.service';
// import { ProgressService } from 'src/progress/progress.service';
// import { ProgressSchema } from 'src/progress/progress.schema';
// import { ModuleSchema } from 'src/modules/modules.schema';
// import { ModulesService } from 'src/modules/modules.service';


// @Module({
//   imports:[
//     MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
//     MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
//     MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
//     MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }])

//   ],
//   providers: [UsersService,CoursesService,ProgressService,ModulesService],
//   controllers: [UsersController],
//   exports:[UsersService,CoursesService,ProgressService,ModulesService],
// })
// export class UsersModule {}
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { InstructorModule } from './instructor/instructor.module';
import { StudentModule } from './student/student.module';
import { UsersSchema } from './users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { CoursesSchema } from 'src/courses/courses.schema';
import { ProgressSchema } from 'src/progress/progress.schema';
import { Progress } from 'src/progress/progress.schema';
import { ProgressService } from 'src/progress/progress.service';
import { CoursesService } from 'src/courses/courses.service';
import { ModuleSchema } from 'src/modules/modules.schema';
import { ResponsesSchema } from 'src/responses/responses.schema';
import { ModulesService } from 'src/modules/modules.service';
import { ResponsesService } from 'src/responses/responses.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { ContentSchema } from 'src/modules/content/content.schema';
import { ContentService } from 'src/modules/content/content.service';
import { QuizzesSchema } from 'src/quizzes/quizzes.schema';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { QuestionsSchema } from 'src/questions/questions.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { StudentService } from './student/student.service';
import { NoteSchema } from 'src/notes/notes.schema';
import { NotesService } from 'src/notes/notes.service';
import { Quiz } from 'src/quizzes/quizzes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Responses', schema: ResponsesSchema }]),
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizzesSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionsSchema }]),
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]), // Add NotesSchema
  ],
  providers: [
    StudentService,
    QuestionsService,
    QuizzesService,
    NotesService,
    ContentService,
    UsersService,
    CoursesService,
    ProgressService,
    ResponsesService,
    ModulesService,
  ],
  controllers: [UsersController],
  exports: [
    StudentService,
    QuestionsService,
    QuizzesService,
    ContentService,
    NotesService,
    MongooseModule,
    UsersService,
    CoursesService,
    ProgressService,
    ResponsesService,
    ModulesService,
  ],
})
export class UsersModule {}