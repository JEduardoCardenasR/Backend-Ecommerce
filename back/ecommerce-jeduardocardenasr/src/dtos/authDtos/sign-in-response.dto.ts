import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SignUpResponseDto } from './sign-up-response.dto';

export class SignInResponseDto extends OmitType(SignUpResponseDto, [
  'createdUser',
]) {
  @ApiProperty({
    example: 'Successfully Logged-in User',
    description: 'Response message confirming successful login',
  })
  message: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token to authenticate user requests',
  })
  token: string;
}
