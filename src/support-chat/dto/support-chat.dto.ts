import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserBasicDto } from 'src/user/dto/user.dto';

export class ConversationMessageDto {
  @ApiProperty({ example: 'uuid-v4', description: 'Message ID' })
  id: string;

  @ApiProperty({ example: 'Hello, I need help', description: 'Message text' })
  text: string;

  @ApiProperty({
    example: false,
    description: 'True if the message was sent by admin',
  })
  isFromAdmin: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class ConversationDto {
  @ApiProperty({ example: 'uuid-v4', description: 'Conversation ID' })
  id: string;

  @ApiPropertyOptional({
    type: () => UserBasicDto,
    description: 'Authenticated user (null for guests)',
    nullable: true,
  })
  user: UserBasicDto | null;

  @ApiPropertyOptional({
    example: 'John',
    description: 'Guest display name (anonymous only)',
    nullable: true,
  })
  guestName: string | null;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Guest email (anonymous only)',
    nullable: true,
  })
  guestEmail: string | null;

  @ApiProperty({ example: false, description: 'True if the user is anonymous' })
  isAnonymous: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
