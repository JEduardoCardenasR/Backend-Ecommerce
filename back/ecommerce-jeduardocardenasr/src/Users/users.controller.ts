import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../Auth/guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Rol } from '../enums/roles.enum';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { ExcludeFieldsInterceptor } from '../interceptors/exclude-password.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dtos/usersDtos/update-user.dto';
import { UserResponseDto } from '../dtos/usersDtos/user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponse({ status: 400, description: 'Bad request, invalid data format' })
@ApiResponse({ status: 401, description: 'Unauthorized access' })
@ApiResponse({
  status: 500,
  description: 'Internal server error. Please try again later.',
})
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // GET ALL USERS
  @Get()
  @ApiOperation({ summary: 'Retrieve all users (Admin only)' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default is 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default is 5)',
    type: Number,
    example: 5,
  })
  @Roles(Rol.Administrator)
  @UseGuards(RolesGuard)
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'confirmPassword']))
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can access this data',
  })
  @ApiResponse({ status: 404, description: 'No users found' })
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

  // GET USER BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID (Authenticated users only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID (UUID format)',
    example: '087513fe-0e35-4ab3-a5da-e367ec122074',
  })
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'isAdmin']),
  )
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.getUserByIdService(id);
  }

  // UPDATE USER BY ID
  @Put(':id')
  @ApiOperation({ summary: 'Update user details (Authenticated users only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID (UUID format)',
    example: '087513fe-0e35-4ab3-a5da-e367ec122074',
  })
  @ApiBody({
    description: 'User data to update',
    type: UpdateUserDto,
    required: true,
  })
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'isAdmin']),
  )
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email is already in use' })
  updateUserController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUserService(id, updatedData);
  }

  // DELETE USER BY ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (Authenticated users only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID (UUID format)',
    example: '087513fe-0e35-4ab3-a5da-e367ec122074',
  })
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'isAdmin']),
  )
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUserController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.deleteUserService(id);
  }
}
