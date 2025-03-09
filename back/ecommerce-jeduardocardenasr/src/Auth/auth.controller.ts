import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/usersDtos/user.dto';
import { ExcludeFieldsInterceptor } from '../interceptors/exclude-password.interceptor';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from '../dtos/usersDtos/loginUser.dto';
import { SignUpResponseDto } from '../dtos/authDtos/sign-up-response.dto';
import { SignInResponseDto } from '../dtos/authDtos/sign-in-response.dto';

@ApiTags('Auth')
@ApiResponse({ status: 400, description: 'Bad request, invalid data format' })
@ApiResponse({
  status: 500,
  description: 'Internal server error. Please try again later.',
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // CREATE A USER
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User data to create',
    type: CreateUserDto,
    required: true,
  })
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'isAdmin']),
  )
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 409,
    description: 'Email has already been registered',
  })
  signUpController(@Body() user: CreateUserDto): Promise<SignUpResponseDto> {
    return this.authService.signUpService(user);
  }

  // LOG IN A USER
  @Post('signin')
  @ApiOperation({ summary: 'Log in to the platform' })
  @ApiBody({
    description: 'User data to login (email and password)',
    type: LoginUserDTO,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signInController(
    @Body() credentials: LoginUserDTO,
  ): Promise<SignInResponseDto> {
    const { email, password }: LoginUserDTO = credentials;

    return this.authService.signInService(email, password);
  }
}
