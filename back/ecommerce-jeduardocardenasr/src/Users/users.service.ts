import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUsersService(page: number, limit: number) {
    return this.usersRepository.getUsers(page, limit);
  }

  async getUserByIdService(id: string) {
    const user = await this.usersRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    }
    return user;
  }

  createUserService(newUser: CreateUserDto): Promise<Partial<Users>> {
    return this.usersRepository.createUser(newUser);
  }

  updateUserService(
    id: string,
    updatedData: UpdateUserDto,
  ): Promise<Partial<Users>> {
    return this.usersRepository.updateUser(id, updatedData);
  }

  async deleteUserService(id: string) {
    const user = await this.usersRepository.deleteUser(id);

    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    }

    return user;
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
