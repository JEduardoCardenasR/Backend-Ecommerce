import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUsersService(
    page: number,
    limit: number,
  ): { users: User[]; totalPages: number; totalUsers: number } {
    return this.usersRepository.getUsers(page, limit);
  }

  getUserByIdService(id: string): User {
    return this.usersRepository.getUserById(id);
  }

  createUserService(newUser: User): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...filteredData } = newUser; //Eliminamos el id por si la solicitud la trae
    return this.usersRepository.createUser(filteredData);
  }

  updateUserService(id: string, updatedData: Partial<User>): User {
    return this.usersRepository.updateUser(id, updatedData);
  }

  deleteUserService(id: string): User {
    return this.usersRepository.deleteUser(id);
  }
}
