import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
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
    required: true,
    description:
      'Full name of the user (String must be between 2 and 50 characters)',
    example: 'Test Edu Cardi',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    required: true,
    description: 'Valid email address',
    example: 'edu.cardi@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description:
      'Password (String must be between 8 and 15 characters and must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character)',
    example: 'SecureP@ss123',
    minLength: 8,
    maxLength: 15,
    pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,15}',
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
    required: true,
    description: 'Confirm password (Must match the password field)',
    example: 'SecureP@ss123',
  })
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'], {
    message: 'Passwords do not match.',
  }) //Este password es el DTO password
  @Matches(/^.*$/, { message: 'Must match the password field.' })
  confirmPassword: string;

  @ApiProperty({
    required: true,
    description: 'User phone number (Must be type isNumber)',
    example: 1234567890,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    required: true,
    description: 'User address - String must be between 2 and 255 characters',
    example: '123 Always Alive Avenue, SaltiYork, México',
    minLength: 2,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  address: string;

  @ApiPropertyOptional({
    description:
      'Country of residence - String must be between 2 and 50 characters (optional)',
    example: 'México',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  country?: string;

  @ApiPropertyOptional({
    description:
      'City of residence - String must be between 2 and 50 characters (optional)',
    example: 'SaltiYork',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  city?: string;

  // @ApiProperty({
  //   description:
  //     'Defines if the user has admin privileges (always empty for security reasons)',
  //   example: null,
  //   required: false,
  // })
  @ApiHideProperty()
  // @IsEmpty()
  isAdmin?: boolean;
}
