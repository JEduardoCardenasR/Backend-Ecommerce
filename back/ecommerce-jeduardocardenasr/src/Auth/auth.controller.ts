import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDTO } from 'src/Users/user.dto';
import { ExcludeSensitiveFieldsInterceptor } from 'src/interceptors/exclude-password.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuthController(): string {
    return this.authService.getAuth();
  }

  @Post('signup')
  @UseInterceptors(ExcludeSensitiveFieldsInterceptor)
  signUp(@Body() user: CreateUserDto) {
    return this.authService.signUpService(user);
  }

  @Post('signin')
  signInController(@Body() credentials: LoginUserDTO) {
    const { email, password } = credentials;

    return this.authService.signInService(email, password);
  }
}
