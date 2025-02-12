import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/Users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuthController(): string {
    return this.authService.getAuth();
  }

  @Post('signin')
  signInController(@Body() credentials: LoginUserDTO) {
    const { email, password } = credentials;

    return this.authService.signInService(email, password);
  }
}
