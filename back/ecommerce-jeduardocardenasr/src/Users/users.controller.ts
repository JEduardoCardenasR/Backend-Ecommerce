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
// import { ExcludeSensitiveFieldsInterceptor } from 'src/interceptors/exclude-password.interceptor';
import { AuthGuard } from '../Auth/guards/auth.guard';
// import { validateUser } from '../utils/users.validate';
import { Users } from '../entities/users.entity';
import { Roles } from '../decorators/roles.decorator';
import { Rol } from '../enums/roles.enum';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { ExcludeFieldsInterceptor } from '../interceptors/exclude-password.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dtos/usersDtos/update-user.dto';
import { UserResponseDto } from '../dtos/usersDtos/user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
// @UseInterceptors(ExcludeSensitiveFieldsInterceptor) //Interceptor para no mostrar password
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  // @HttpCode(HttpStatus.OK) // Para darle el código de respuesta pero es redundante porque nest ya lo hace por detrás
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiSecurity('roles')
  @Roles(Rol.Administrator)
  @UseGuards(RolesGuard)
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'confirmPassword']))
  @ApiOperation({ summary: 'Retrieve all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can access this data',
  })
  getUsersController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<UserResponseDto[]> {
    const pageNumber: number =
      page && !isNaN(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const limitNumber: number =
      limit && !isNaN(Number(limit)) && Number(limit) > 0 ? Number(limit) : 5;

    return this.userService.getUsersService(pageNumber, limitNumber);
  }

  @Get(':id')
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'isAdmin']),
  )
  @ApiOperation({ summary: 'Retrieve a user by ID (Authenticated users only)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  getUserByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.getUserByIdService(id);
  }

  // @Post()
  // createUserController(
  //   @Body() newUser: CreateUserDto,
  // ): Promise<Partial<Users>> {
  //   return this.userService.createUserService(newUser);
  // }

  @Put(':id')
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'isAdmin']),
  )
  @ApiOperation({ summary: 'Update user details (Authenticated users only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiBody({
    description: 'User data to update',
    type: UpdateUserDto, // Usamos el DTO
    required: true,
  })
  updateUserController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUserService(id, updatedData);
  }

  @Delete(':id')
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'isAdmin']),
  )
  @ApiOperation({ summary: 'Delete a user (Authenticated users only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  deleteUserController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
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
