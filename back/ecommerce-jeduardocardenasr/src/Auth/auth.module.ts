import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from 'src/Users/users.repository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
