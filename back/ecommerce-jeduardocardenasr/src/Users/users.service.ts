import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUsersService(page: number, limit: number) {
    return this.usersRepository.getUsers(page, limit);
  }

  getUserByIdService(id: string) {
    return this.usersRepository.getUserById(id);
  }

  createUserService(newUser: Users): Promise<Partial<Users>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...filteredData } = newUser; //Eliminamos el id por si la solicitud la trae
    return this.usersRepository.createUser(filteredData);
  }

  updateUserService(
    id: string,
    updatedData: Partial<Users>,
  ): Promise<Partial<Users>> {
    return this.usersRepository.updateUser(id, updatedData);
  }

  deleteUserService(id: string) {
    return this.usersRepository.deleteUser(id);
  }
}
