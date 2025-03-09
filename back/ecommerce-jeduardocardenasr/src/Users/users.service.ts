import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from '../dtos/usersDtos/update-user.dto';
import { UserResponseDto } from '../dtos/usersDtos/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // GET ALL USERS
  async getUsersService(
    page: number,
    limit: number,
  ): Promise<UserResponseDto[]> {
    const skip: number = (page - 1) * limit;
    const users: UserResponseDto[] =
      await this.usersRepository.getUsersRepository(skip, limit);
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  // GET USER BY ID
  async getUserByIdService(id: string): Promise<UserResponseDto> {
    const user: UserResponseDto =
      await this.usersRepository.getUserByIdRepository(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    return user;
  }

  // UPDATE USER BY ID
  async updateUserService(
    id: string,
    updatedData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user: UserResponseDto =
      await this.usersRepository.getUserByIdRepository(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found`);
    }

    if (updatedData.email) {
      const foudname: UserResponseDto =
        await this.usersRepository.getUserByEmailRepository(updatedData.email);
      if (foudname) throw new ConflictException(`Email has already been used`);
    }

    return this.usersRepository.updateUserRepository(id, updatedData);
  }

  // DELETE USER BY ID
  async deleteUserService(id: string): Promise<UserResponseDto> {
    const userToDelete: UserResponseDto =
      await this.usersRepository.getUserByIdRepository(id);

    if (!userToDelete) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    await this.usersRepository.deleteUserRepository(userToDelete.id);

    return userToDelete;
  }
}
