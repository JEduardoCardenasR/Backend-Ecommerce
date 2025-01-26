import { Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/users.interface';

@Injectable()
export class UsersRepository {
  private users: User[] = [
    {
      id: 1,
      email: 'edu@mail.com',
      name: 'Edu',
      password: '123456789',
      address: 'Siempre Viva 123',
      phone: '8442202020',
      country: 'México',
      city: 'Saltio',
    },
    {
      id: 2,
      email: 'leo@mail.com',
      name: 'Leo',
      password: '123456789',
      address: 'Siempre Viva 123',
      phone: '8442202020',
      country: 'México',
      city: 'Saltio',
    },
    {
      id: 3,
      email: 'deivid@mail.com',
      name: 'Deivid',
      password: '123456789',
      address: 'Siempre Viva 123',
      phone: '8442202020',
      country: 'México',
      city: 'Saltio',
    },
  ];

  getUsers(): User[] {
    return this.users;
  }
}
