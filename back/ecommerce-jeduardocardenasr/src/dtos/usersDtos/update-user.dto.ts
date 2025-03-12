import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'Edu Cardi',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'Valid email address',
    example: 'educardi@mail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: 1234567890,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  phone?: number;

  @ApiPropertyOptional({
    description: 'User address',
    example: '123 Always Alive Avenue, SaltiYork, México',
    minLength: 2,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    description: 'Country of residence',
    example: 'México',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  country?: string;

  @ApiPropertyOptional({
    description: 'City of residence',
    example: 'SaltiYork',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city?: string;

  @ApiPropertyOptional({
    description: 'Date of birth (Structure must be FullYear-Month-Day)',
    example: '2024-03-01',
  })
  dateOfBirth?: string;
}
