import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/usersDtos/user.dto';
import { ExcludeFieldsInterceptor } from '../interceptors/exclude-password.interceptor';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from '../dtos/usersDtos/loginUser.dto';
import { SignUpResponseDto } from '../dtos/authDtos/sign-up-response.dto';
import { SignInResponseDto } from '../dtos/authDtos/sign-in-response.dto';
// import { ExcludeSensitiveFieldsInterceptor } from 'src/interceptors/exclude-password.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get()
  // getAuthController(): string {
  //   return this.authService.getAuth();
  // }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data for registration' })
  // @UseInterceptors(ExcludeSensitiveFieldsInterceptor)
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'isAdmin']),
  )
  signUpController(@Body() user: CreateUserDto): Promise<SignUpResponseDto> {
    return this.authService.signUpService(user);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Log in to the platform' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signInController(
    @Body() credentials: LoginUserDTO,
  ): Promise<SignInResponseDto> {
    const { email, password }: { email: string; password: string } =
      credentials;

    return this.authService.signInService(email, password);
  }
}
