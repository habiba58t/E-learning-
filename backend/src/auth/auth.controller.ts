import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signInDto';
import { RegisterDto } from './dto/registerDto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() signInDto: SignInDto) {
        try {
            console.log('Attempting login...');
            // Call the AuthService to handle login
            const result = await this.authService.login(signInDto);

            // Set the token in the cookie
            // res.cookie('token', result.access_token, {
            //     httpOnly: true, // Prevents client-side JavaScript access
            //     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            //     maxAge: 3600 * 1000, // Cookie expiration time in milliseconds
            // });

            // Return success response
            return {
                statusCode: HttpStatus.OK,
                message: 'Login successful',
                user: result.payload,
            };
        } catch (error) {
            console.log(error);

            // Handle specific errors
            if (error instanceof HttpException) {
                throw error; // Pass through known exceptions
            }

            // Handle other unexpected errors
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred during login',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('register')
    async register(@Body() registerRequestDto: RegisterDto) {
        try {
            // Call the AuthService to handle registration
            const result = await this.authService.register(registerRequestDto);

            // Return a success response with HTTP 201 Created status
            return {
                statusCode: HttpStatus.CREATED,
                message: 'User registered successfully',
                data: result, // Include more details here if necessary
            };
        } catch (error) {
            console.log(error);

            // Handle specific errors, such as email already exists or validation errors
            if (error.status === 409) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        message: 'User with this email already exists',
                    },
                    HttpStatus.CONFLICT,
                );
            }

            // Handle other errors (e.g., validation errors)
            if (error.status === 400) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: 'Invalid input data',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Catch any other errors and throw a generic internal server error
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred during registration',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
