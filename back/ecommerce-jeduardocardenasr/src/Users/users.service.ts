import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUsers() {
    return 'Obtener todos los usuarios';
  }
}
