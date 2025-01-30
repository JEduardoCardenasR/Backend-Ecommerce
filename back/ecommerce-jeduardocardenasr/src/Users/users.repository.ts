import { Injectable } from '@nestjs/common';
import { User } from './users.entity';

@Injectable()
export class UsersRepository {
  private users: User[] = [
    {
      id: 1,
      email: 'edu@mail.com',
      name: 'Edu',
      password: '123456789',
      address: 'Avenida Siempre Viva 123',
      phone: '8442202020',
      country: 'México',
      city: 'Saltio',
    },
    {
      id: 2,
      email: 'leo@mail.com',
      name: 'Leo',
      password: '123456789',
      address: 'Avenida Siempre Viva 123',
      phone: '8442202020',
      country: 'México',
      city: 'Saltio',
    },
    {
      id: 3,
      email: 'deivid@mail.com',
      name: 'Deivid',
      password: '123456789',
      address: 'Avenida Siempre Viva 123',
      phone: '8442202020',
      country: 'México',
      city: 'Saltio',
    },
  ];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    return this.users.find((user) => user.id === Number(id)); // O puedes usar +id
  }

  createUser(newUser: Omit<User, 'id'>): User {
    const id = this.users.length + 1;
    this.users.push({ id, ...newUser });
    return { id, ...newUser };
  }

  updateUser(id: string, updatedData: Partial<User>): User {
    const index = this.users.findIndex((user) => user.id === Number(id));
    const { id: _, ...filteredData } = updatedData; //Renombra id como _ Es útil para evitar que un id enviado en una solicitud sobrescriba el real.
    this.users[index] = { ...this.users[index], ...filteredData };
    return this.users[index];
  }

  deleteUser(id: string): User {
    const index = this.users.findIndex((user) => user.id === Number(id));
    const deletedUser = this.users[index];
    this.users.splice(index, 1); // Eliminar usuario del array
    return deletedUser;
  }
}
