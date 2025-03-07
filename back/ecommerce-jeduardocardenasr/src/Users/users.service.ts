import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from '../entities/users.entity';
import { UpdateUserDto } from 'src/dtos/usersDtos/update-user.dto';
import { UserResponseDto } from 'src/dtos/usersDtos/user.response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUsersService(page: number, limit: number): Promise<UserResponseDto[]> {
    const skip: number = (page - 1) * limit;
    return this.usersRepository.getUsersRepository(skip, limit);
  }

  async getUserByIdService(id: string): Promise<UserResponseDto> {
    const user: UserResponseDto =
      await this.usersRepository.getUserByIdRepository(id);

    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    }
    return user;
  }

  // createUserService(newUser: CreateUserDto): Promise<Partial<Users>> {
  //   return this.usersRepository.createUser(newUser);
  // }

  async updateUserService(
    id: string,
    updatedData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (updatedData.email) {
      const foudname: UserResponseDto =
        await this.usersRepository.getUserByEmailRepository(updatedData.email);
      if (foudname)
        throw new BadRequestException(`Email has already been used`);
    }

    return this.usersRepository.updateUserRepository(id, updatedData);
  }

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

// createUserService(newUser: Users): Promise<Partial<Users>> {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { id, ...filteredData } = newUser; //Eliminamos el id por si la solicitud la trae
//   return this.usersRepository.createUser(filteredData);
// }

// updateUserService(
//   id: string,
//   updatedData: Partial<Users>,
// ): Promise<Partial<Users>> {
//   return this.usersRepository.updateUser(id, updatedData);
// }
