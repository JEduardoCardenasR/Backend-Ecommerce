import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUsersService(): User[] {
    return this.usersRepository.getUsers();
  }

  getUserByIdService(id: string): User {
    return this.usersRepository.getUserById(id);
  }

  createUserService(newUser: User): User {
    const { id, ...filteredData } = newUser; //Eliminamos el id
    return this.usersRepository.createUser(filteredData);
  }

  updateUserService(id: string, updatedData: Partial<User>): User {
    return this.usersRepository.updateUser(id, updatedData);
  }

  deleteUserService(id: string): User {
    return this.usersRepository.deleteUser(id);
  }
}
