import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
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
import { MatchPassword } from '../decorators/matchPassword.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Edu Cardi',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: 'Valid email address',
    example: 'edu.cardi@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password (must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character)',
    example: 'SecureP@ss123',
  })
  @IsNotEmpty()
  @IsString()
  // @IsStrongPassword(
  // minUppercase: 1,
  // minLowercase: 1,
  // )
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(15, { message: 'Password must be at most 15 characters long.' })
  @Matches(/[a-z]/, {
    message: 'Password must include at least one lowercase letter.',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must include at least one uppercase letter.',
  })
  @Matches(/\d/, { message: 'Password must include at least one number.' })
  @Matches(/[!@#$%^&*]/, {
    message: 'Password must include at least one special character (!@#$%^&*).',
  })
  password: string;

  //Valida directamente dentro del DTO
  @ApiProperty({
    description: 'Confirm password (must match the password field)',
    example: 'SecureP@ss123',
  })
  @IsNotEmpty()
  @Validate(MatchPassword, ['password']) //Este password es el DTO password
  confirmPassword: string;

  @ApiProperty({
    description: 'User phone number',
    example: 1234567890,
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    description: 'User address',
    example: '123 Always Alive Avenue, Springfield, USA',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    description: 'Country of residence (optional)',
    example: 'United States',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @ApiProperty({
    description: 'City of residence (optional)',
    example: 'New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  city?: string;

  @ApiProperty({
    description:
      'Defines if the user has admin privileges (always empty for security reasons)',
    example: null,
    required: false,
  })
  @IsEmpty()
  isAdmin?: boolean;
}
