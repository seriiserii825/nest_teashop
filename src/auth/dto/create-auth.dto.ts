import { ApiProperty } from '@nestjs/swagger';
import { UserBasicDto } from 'src/user/dto/user.dto';

export class LoginResponseDto {
  @ApiProperty({ type: UserBasicDto })
  user: UserBasicDto;

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
