import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  // imports: [TypeOrmModule.forFeature([Users])] //No neceseito importarlo porque ya se incluye en UsersModule
  imports: [UsersModule], //Mejor se importa UsersModules que ya contiene UsersRepository
  controllers: [AuthController],
  providers: [AuthService],
  // providers: [AuthService, UsersRepository], //Si UsersRepository es proveedor en módules diferentes puede causar conflictos en la inyección de dependencias
})
export class AuthModule {}
