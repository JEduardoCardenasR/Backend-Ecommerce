import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from '../dtos/usersDtos/update-user.dto';
import { UserResponseDto } from '../dtos/usersDtos/user-response.dto';
import { Users } from '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // GET ALL USERS
  async getUsersService(
    page: number,
    limit: number,
  ): Promise<UserResponseDto[]> {
    const skip: number = (page - 1) * limit;
    const users: Users[] = await this.usersRepository.getUsersRepository(
      skip,
      limit,
    );
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }

    const returnUsers: UserResponseDto[] = users.map((user) => ({
      ...user,
      dateOfBirth: user.dateOfBirth.toISOString().split('T')[0],
    }));

    return returnUsers;
  }

  // GET USER BY ID
  async getUserByIdService(id: string): Promise<UserResponseDto> {
    const user: Users = await this.usersRepository.getUserByIdRepository(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    return {
      ...user,
      dateOfBirth: user.dateOfBirth.toISOString().split('T')[0],
    };
  }

  // UPDATE USER BY ID
  async updateUserService(
    id: string,
    updatedData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user: Users = await this.usersRepository.getUserByIdRepository(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found`);
    }

    if (updatedData.email) {
      const foudname: Users =
        await this.usersRepository.getUserByEmailRepository(updatedData.email);
      if (foudname) throw new ConflictException(`Email has already been used`);
    }

    const updatedUser: Users = await this.usersRepository.updateUserRepository(
      id,
      updatedData,
    );

    return {
      ...updatedUser,
      dateOfBirth: updatedUser.dateOfBirth.toISOString().split('T')[0],
    };
  }

  // DELETE USER BY ID
  async deleteUserService(id: string): Promise<UserResponseDto> {
    const userToDelete: Users =
      await this.usersRepository.getUserByIdRepository(id);

    if (!userToDelete) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    await this.usersRepository.deleteUserRepository(userToDelete.id);

    return {
      ...userToDelete,
      dateOfBirth: userToDelete.dateOfBirth.toISOString().split('T')[0],
    };
  }
}
