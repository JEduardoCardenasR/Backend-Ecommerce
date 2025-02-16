import { PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  // IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // @IsStrongPassword(
  // minUppercase: 1,
  // minLowercase: 1,
  // )
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(15, { message: 'La contraseña debe tener máximo 15 caracteres.' })
  @Matches(/[a-z]/, {
    message: 'La contraseña debe incluir al menos una letra minúscula.',
  })
  @Matches(/[A-Z]/, {
    message: 'La contraseña debe incluir al menos una letra mayúscula.',
  })
  @Matches(/\d/, { message: 'La contraseña debe incluir al menos un número.' })
  @Matches(/[!@#$%^&*]/, {
    message:
      'La contraseña debe incluir al menos un símbolo especial (!@#$%^&*).',
  })
  password: string;

  //Valida directamente dentro del DTO
  @IsNotEmpty()
  @Validate(MatchPassword, ['password']) //Este password es el DTO password
  confirmPassword: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  city?: string;
}

export class LoginUserDTO extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
