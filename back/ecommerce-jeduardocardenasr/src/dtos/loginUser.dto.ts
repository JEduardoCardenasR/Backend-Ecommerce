import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/user.dto';

export class LoginUserDTO extends PickType(CreateUserDto, [
  'email',
  'password',
]) {
  @ApiProperty({
    description: 'User email address',
    example: 'edu.cardi@mail.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecureP@ss123',
  })
  password: string;
}
