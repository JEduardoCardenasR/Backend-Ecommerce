import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../usersDtos/user-response.dto';

export class SignUpResponseDto {
  @ApiProperty({
    description:
      'Message indicating that the user has been successfully registered.',
    example: 'Successfully Signed-Up User',
  })
  message: string;

  @ApiProperty({
    description: 'Object containing the details of the newly created user.',
    type: UserResponseDto,
  })
  createdUser: Partial<UserResponseDto>;

  @ApiProperty({
    description:
      'JWT token generated to authenticate the user after registration.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmMzZGU0LWNhNWItNDI0OC04MTMxLWE3Y2ZkNWVmOThhOCIsImVtYWlsIjoiZWR1LmNhcmRpQG1haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTc0MTQwMDI0NSwiZXhwIjoxNzQxNDAzODQ1fQ.B31zQc9JEqNPfZFhqApuP9rTWBGz3Mh_K5Yu5S8YYVI',
  })
  token: string;
}
