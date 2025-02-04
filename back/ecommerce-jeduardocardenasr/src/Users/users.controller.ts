import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ExcludePasswordInterceptor } from 'src/interceptors/exclude-password.interceptor';
import { AuthGuard } from 'src/Auth/auth-guard.guard';
import { validateUser } from 'src/utils/users.validate';
import { Users } from 'src/entities/users.entity';

@Controller('users')
@UseInterceptors(ExcludePasswordInterceptor) //Interceptor para no mostrar password
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  // @HttpCode(HttpStatus.OK) // Para darle el código de respuesta pero es redundante porque nest ya lo hace por detrás
  @UseGuards(AuthGuard)
  getUsersController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): { users: Users[]; totalPages: number; totalUsers: number } {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 5;

    return this.userService.getUsersService(pageNumber, limitNumber);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUserByIdController(@Param('id') id: string): Users {
    return this.userService.getUserByIdService(id);
  }

  @Post()
  // @HttpCode(HttpStatus.CREATED) // Para darle el código de respuesta pero es redundante porque nest ya lo hace por detrás
  createUserController(@Body() newUser: Users): Users | string {
    if (validateUser(newUser)) {
      return this.userService.createUserService(newUser);
    }
    return 'Usuario no válido';
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateUserController(
    @Param('id') id: string,
    @Body() updatedData: Partial<Users>,
  ): Users | string {
    if (validateUser(updatedData)) {
      return this.userService.updateUserService(id, updatedData);
    }
    return 'Usuario no válido';
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUserController(@Param('id') id: string): Users {
    return this.userService.deleteUserService(id);
  }
}
