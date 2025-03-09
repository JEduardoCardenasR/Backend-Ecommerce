import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dtos/usersDtos/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  // GET ALL USERS
  async getUsersRepository(skip: number, limit: number): Promise<Users[]> {
    return await this.usersRepository.find({
      relations: { orders: true },
      take: limit,
      skip: skip,
    });
  }

  // GET USER BY ID
  async getUserByIdRepository(id: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
  }

  // GET USER BY EMAIL
  async getUserByEmailRepository(email: string): Promise<Users> {
    return await this.usersRepository.findOneBy({ email });
  }

  // UPDATE USER BY ID
  async updateUserRepository(id: string, user: UpdateUserDto): Promise<Users> {
    await this.usersRepository.update(id, user);
    return await this.usersRepository.findOneBy({ id });
  }

  // DELETE USER BY ID
  async deleteUserRepository(id: string) {
    await this.usersRepository.delete(id);
  }

  //CREATE USER
  async createUserRepository(user: Partial<Users>): Promise<Partial<Users>> {
    return await this.usersRepository.save(user);
  }
}
