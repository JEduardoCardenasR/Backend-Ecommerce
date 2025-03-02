import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/user.dto';
import { ExcludeFieldsInterceptor } from '../interceptors/exclude-password.interceptor';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from '../dtos/loginUser.dto';
import { Users } from '../entities/users.entity';
import { OrderDetails } from '../entities/orders_detail.entity';
import { Orders } from '../entities/orders.entity';
import { Categories } from '../entities/categories.entity';
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
  signUp(@Body() user: CreateUserDto) {
    return this.authService.signUpService(user);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Log in to the platform' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signInController(@Body() credentials: LoginUserDTO) {
    const { email, password } = credentials;

    return this.authService.signInService(email, password);
  }

  @Post()
  @ApiOperation({ summary: 'This is just a test route' })
  entitiesController(
    @Body() user: Users,
    @Body() orders: Orders,
    @Body() ordersDetails: OrderDetails,
    @Body() categories: Categories,
  ) {
    const entitiesObject = {
      user: user,
      orders_detail: ordersDetails,
      orders: orders,
      categories: categories,
    };
    return entitiesObject;
  }
}
