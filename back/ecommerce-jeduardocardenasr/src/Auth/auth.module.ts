import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { UsersRepository } from 'src/Users/users.repository';
import { UsersModule } from '../Users/users.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Users } from 'src/entities/users.entity';

@Module({
  // imports: [TypeOrmModule.forFeature([Users])] //No neceseito importarlo porque ya se incluye en UsersModule
  imports: [UsersModule], //Mejor se importa UsersModules que ya contiene UsersRepository
  controllers: [AuthController],
  providers: [AuthService],
  // providers: [AuthService, UsersRepository], //Si UsersRepository es proveedor en módules diferentes puede causar conflictos en la inyección de dependencias
})
export class AuthModule {}
