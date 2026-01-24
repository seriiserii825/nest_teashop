import { ApiProperty } from '@nestjs/swagger';
import { TUserResponseDto } from 'src/user/dto/user.dto';

export class LoginResponseDto {
  @ApiProperty({ type: TUserResponseDto })
  user: TUserResponseDto;

  @ApiProperty({
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
    },
  })
  tokens: {
    accessToken: string;
  };
}
