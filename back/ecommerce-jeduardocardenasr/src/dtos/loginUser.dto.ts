import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from 'src/dtos/user.dto';

export class LoginUserDTO extends PickType(CreateUserDto, [
  'email',
  'password',
]) {
  @ApiProperty({
    required: true,
    description: 'User email address',
    example: 'edu.cardi@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'User password',
    example: 'SecureP@ss123',
    minLength: 8,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  password: string;
}
