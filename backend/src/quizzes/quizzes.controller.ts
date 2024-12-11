import { Controller, Get, Post, Body, Patch, Param, Delete, Request, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import mongoose, {Types} from 'mongoose';
import { QuizzesDocument } from './quizzes.schema';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
//import { Types } from 'mongoose';


@UseGuards(AuthGuard) // Apply AuthGuard globally to all methods


@Controller('quizzes')
export class QuizzesController {

  constructor(private readonly quizzesService: QuizzesService) {}


  // @UseGuards(AuthorizationGuard) // Additional guard for authorization
  // @Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
  // @Post('generate/:moduleId')
  // async generateQuiz( //instructor creates quiz
  //   @Param('moduleId') moduleId: string,
  //   @Body('no_of_questions') noOfQuestions: number,
  //   @Body('types_of_questions') typesOfQuestions: 'mcq' | 't/f' | 'both',
  // ) {
  //   try {
  //     // Validate and convert the moduleId to an ObjectId
  //     const moduleObjectId = new Types.ObjectId(moduleId);

  //     // Call the service method to generate the quiz
  //     const quiz = await this.quizzesService.generateQuiz(
  //       noOfQuestions,
  //       typesOfQuestions,
  //       moduleObjectId,
  //     );

  //     // Return the generated quiz
  //     return {
  //       message: 'Quiz generated successfully',
  //       quiz,
  //     };
  //   } catch (error) {
  //     return {
  //       message: 'Error generating quiz',
  //       error: error.message,
  //     };
  //   }
  // }

 
    @Get(':quizId')
    async getQuizByQuizId(@Param('quizId') quizId: string) {
      try {
        // Validate and convert the quizId to an ObjectId
        const quizObjectId = new Types.ObjectId(quizId);
  
        // Fetch the quiz by ID
        const quiz = await this.quizzesService.getQuizByQuizId(quizObjectId);
  
        // Return the quiz
        return {
          message: 'Quiz fetched successfully',
          quiz,
        };
      } catch (error) {
        // Handle the case where the quiz is not found
        if (error.message === 'Quiz not found') {
          throw new NotFoundException('Quiz not found');
        }
        throw error;
      }
    }
  

@UseGuards(AuthorizationGuard) // Additional guard for authorization
@Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
    @Get(':instructorId')
    async getQuizzesByInstructorId(@Param('instructorId') instructorId: string) {
      try {
        // Convert instructorId to a valid ObjectId
        const quizObjectId = new Types.ObjectId(instructorId); // Convert to ObjectId
        
        const quizzes = await this.quizzesService.getQuizzesByInstructorId(quizObjectId);
        
        // Check if quizzes are empty
        if (!quizzes || quizzes.length === 0) {
          throw new NotFoundException('No quizzes found for this instructor');
        }
    
        return {
          message: 'Quizzes fetched successfully',
          quizzes,
        };
      } catch (error) {
        // Log the actual error message
        throw new NotFoundException(error.message || 'Error fetching quizzes');
      }
    }
    
    @Get('student/:username')
  async getQuizzesForStudent(@Param('username') username: string) {
    try {
      const quizzes: QuizzesDocument[] = await this.quizzesService.getQuizzesForStudents(username);
      
      // Check if quizzes are found, otherwise throw an error
      if (!quizzes || quizzes.length === 0) {
        throw new NotFoundException('No quizzes found for the student');
      }

      return {
        message: 'Quizzes fetched successfully',
        quizzes,
      };
    } catch (error) {
      // If there is any error, throw a NotFoundException
      throw new NotFoundException(error.message || 'An error occurred while fetching quizzes');
    }
  }

  //skipped toggle outdated
  @UseGuards(AuthorizationGuard) // Additional guard for authorization
@Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
  @Get('responses/:quizId')
  async getResponsesByQuizId(@Param('quizId') quizId: string) {
    try {
      const quizObjectId = new mongoose.Types.ObjectId(quizId); // Convert the string quizId to ObjectId
      const responses = await this.quizzesService.getResponsesByQuizId(quizObjectId);
      
      return {
        message: 'Quiz responses fetched successfully',
        responses,
      };
    } catch (error) {
      throw new NotFoundException(error.message || 'Quiz not found');
    }
  }

  @Get('response/:quizId/:username')
  async getResponsesByQuizIdAndUsername(
    @Param('quizId') quizId: string,
    @Param('username') username: string,
  ) {
    try {
      const quizObjectId = new mongoose.Types.ObjectId(quizId); // Convert quizId to ObjectId
      const response = await this.quizzesService.getResponsesByQuizIdAndUsername(quizObjectId, username);
      
      return {
        message: 'Student response fetched successfully',
        response,
      };
    } catch (error) {
      throw new NotFoundException(error.message || 'Response not found');
    }
  }


  @Get('check-status/:quizId/:username')
  async checkStudentQuizStatus(
    @Param('quizId') quizId: string,
    @Param('username') username: string,
  ) {
    try {
      const quizObjectId = new mongoose.Types.ObjectId(quizId); // Convert quizId to ObjectId
      const hasResponded = await this.quizzesService.checkStudentQuizStatus(quizObjectId, username);
      
      return {
        message: hasResponded
          ? 'Student has responded to the quiz'
          : 'Student has not responded to the quiz',
        hasResponded,
      };
    } catch (error) {
      throw new NotFoundException(error.message || 'Quiz not found');
    }
  }


// Endpoint to submit quiz answers
@Post(':quizId/:username/submit')  // Both quizId and username are part of the URL path
async submitQuiz(
  @Param('quizId') quizId: string,  // Extract quizId from params
  @Param('username') username: string,  // Extract username from params
  @Body() studentAnswersObject: Record<string, string>  // Extract student answers from the request body
) {
  try {
    // Convert quizId to ObjectId if needed, assuming you're working with mongoose Types
    const quizObjectId = new mongoose.Types.ObjectId(quizId);

    // Call the service method and pass the quizId, username, and answers object
    const result = await this.quizzesService.submitQuiz(
      quizObjectId,            // quizId from params
      username,                // username from params
      studentAnswersObject, // studentAnswersObject from body
    );
    
    return result;  // Return the response from the service
  } catch (error) {
    throw new BadRequestException(error.message || 'Something went wrong');
  }
}

@UseGuards(AuthorizationGuard) // Additional guard for authorization
@Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
   // Delete a quiz by its ID
   @Delete(':quizId')
   async deleteQuiz(@Param('quizId') quizId: string) {
     try {
       const quizObjectId = new mongoose.Types.ObjectId(quizId); // Convert quizId to ObjectId
       const result = await this.quizzesService.deleteQuiz(quizObjectId);
 
       return {
         message: result.message, // Return success message from service
       };
     } catch (error) {
       throw new NotFoundException(error.message || 'Quiz not found');
     }
   }




}
  