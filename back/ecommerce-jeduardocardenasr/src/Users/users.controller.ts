import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Param,
  ParseUUIDPipe,
  // Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ExcludeSensitiveFieldsInterceptor } from 'src/interceptors/exclude-password.interceptor';
import { AuthGuard } from 'src/Auth/auth-guard.guard';
// import { validateUser } from 'src/utils/users.validate';
import { Users } from 'src/entities/users.entity';
import { CreateUserDto } from './user.dto';

@Controller('users')
@UseInterceptors(ExcludeSensitiveFieldsInterceptor) //Interceptor para no mostrar password
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  // @HttpCode(HttpStatus.OK) // Para darle el código de respuesta pero es redundante porque nest ya lo hace por detrás
  @UseGuards(AuthGuard)
  getUsersController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 5;

    return this.userService.getUsersService(pageNumber, limitNumber);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUserByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserByIdService(id);
  }

  // @Post()
  // createUserController(
  //   @Body() newUser: CreateUserDto,
  // ): Promise<Partial<Users>> {
  //   return this.userService.createUserService(newUser);
  // }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateUserController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedData: Partial<CreateUserDto>,
  ): Promise<Partial<Users>> {
    return this.userService.updateUserService(id, updatedData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUserController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Partial<Users>> {
    return this.userService.deleteUserService(id);
  }
}

// @Post()
//   // @HttpCode(HttpStatus.CREATED) // Para darle el código de respuesta pero es redundante porque nest ya lo hace por detrás
//   createUserController(
//     @Body() newUser: Users,
//   ): Promise<Partial<Users>> | string {
//     if (validateUser(newUser)) {
//       return this.userService.createUserService(newUser);
//     }
//     return 'Usuario no válido';
//   }

// @Put(':id')
//   @UseGuards(AuthGuard)
//   updateUserController(
//     @Param('id') id: string,
//     @Body() updatedData: Partial<Users>,
//   ): Promise<Partial<Users>> | string {
//     if (validateUser(updatedData)) {
//       return this.userService.updateUserService(id, updatedData);
//     }
//     return 'Usuario no válido';
//   }
