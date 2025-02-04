import { Injectable } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class UsersRepository {
  private users: Users[] = [];

  getUsers(
    page: number,
    limit: number,
  ): { users: Users[]; totalPages: number; totalUsers: number } {
    const totalUsers = this.users.length; //Esto es para que devuelva el total de usuarios
    const totalPages = Math.ceil(totalUsers / limit); //Esto es para que devuelva el total de páginas
    const start = (page - 1) * limit;
    const end = start + limit;

    //Devuelve un array con ciertos elementos del array origianl (lo corta)
    return {
      users: this.users.slice(start, end), //No incluye el elemento en la posición del límite (en este caso 2)
      totalUsers,
      totalPages,
    };
    // Si no hay interceptor esta sería la forma de quitarle el password a cada uno de los elementos de array
    // const users = userPage.map(({password, ...userWithoutPassword}) => userWithoutPassword )
    // return users;
  }

  getUserById(id: string): Users {
    return this.users.find((user) => user.id === id); // O puedes usar +id
  }

  createUser(newUser: Omit<Users, 'id'>): Users {
    const idNumber = this.users.length + 1;
    const id = idNumber.toString();
    this.users.push({ id, ...newUser });
    return { id, ...newUser };
  }

  updateUser(id: string, updatedData: Partial<Users>): Users {
    const index = this.users.findIndex((user) => user.id === id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...filteredData } = updatedData; //Renombra id como _ Es útil para evitar que un id enviado en una solicitud sobrescriba el real.
    this.users[index] = { ...this.users[index], ...filteredData };
    return this.users[index];
  }

  // Opción que recorre todo el array y si coincide con el id lo cambia:
  // updateUser(id:string, updatedData: Partial<User>): User {
  //   const usuario = this.users.find((u) => u.id === +id);
  //   const updatedUser = {...usuario, ...updatedData};
  //   this.users.map((u) => (u.id === +id ? updatedUser : updatedData));
  //   const { password, ...userWithoutPassword } = updatedUser; // Opción para filtrar el password sin interceptor (pero tendría que ponerse en todos los métodos)
  //   return userWithoutPassword;
  // }

  deleteUser(id: string): Users {
    const index = this.users.findIndex((user) => user.id === id);
    const deletedUser = this.users[index];
    this.users.splice(index, 1); // Eliminar usuario del array
    return deletedUser;
  }

  // Opción que crea un nuevo array
  // deleteUser(id: string): User {
  //   const user = this.users.find((user) => user.id === id);
  //   this.users = this.users.filter((user) => user.id !== id); //Crea un nuevo array con los elementos que no se van a eliminar
  //   const { password, ...userWithoutPassword } = user; // Opción para filtrar el password sin interceptor (pero tendría que ponerse en todos los métodos)
  //   return userWithoutPassword;
  // }

  getUserByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);
    return user;
  }
}
