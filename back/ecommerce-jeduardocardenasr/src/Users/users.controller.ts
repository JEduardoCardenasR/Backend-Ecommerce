import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { ExcludePasswordInterceptor } from 'src/interceptors/exclude-password.interceptor';
import { AuthGuard } from 'src/Auth/auth-guard.guard';

@Controller('users')
@UseInterceptors(ExcludePasswordInterceptor) //Interceptor para no mostrar password
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUsersController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): { users: User[]; totalPages: number; totalUsers: number } {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 5;

    return this.userService.getUsersService(pageNumber, limitNumber);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUserByIdController(@Param('id') id: string): User {
    return this.userService.getUserByIdService(id);
  }

  @Post()
  createUserController(@Body() newUser: User): User {
    return this.userService.createUserService(newUser);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateUserController(
    @Param('id') id: string,
    @Body() updatedData: Partial<User>,
  ): User {
    return this.userService.updateUserService(id, updatedData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUserController(@Param('id') id: string): User {
    return this.userService.deleteUserService(id);
  }
}
