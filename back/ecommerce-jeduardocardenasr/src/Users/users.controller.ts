import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { ExcludePasswordInterceptor } from 'src/interceptors/exclude-password.interceptor';

@Controller('users')
@UseInterceptors(ExcludePasswordInterceptor) //Interceptor para no mostrar password
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsersController(): User[] {
    return this.userService.getUsersService();
  }

  @Get(':id')
  getUserByIdController(@Param('id') id: string): User {
    return this.userService.getUserByIdService(id);
  }

  @Post()
  createUserController(@Body() newUser: User): User {
    return this.userService.createUserService(newUser);
  }

  @Put(':id')
  updateUserController(
    @Param('id') id: string,
    @Body() updatedData: Partial<User>,
  ): User {
    return this.userService.updateUserService(id, updatedData);
  }

  @Delete(':id')
  deleteUserController(@Param('id') id: string): User {
    return this.userService.deleteUserService(id);
  }
}
