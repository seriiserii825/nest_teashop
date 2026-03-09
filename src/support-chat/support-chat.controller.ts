import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Admin } from 'src/auth/decorators/admin.decorator';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import {
  ConversationDto,
  ConversationMessageDto,
} from './dto/support-chat.dto';
import { SupportChatService } from './support-chat.service';

@ApiTags('Support Chat')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Admin()
@AuthJwt()
@Controller('support-chat')
export class SupportChatController {
  constructor(private readonly supportChatService: SupportChatService) {}

  @Get('conversations')
  @ApiOkResponse({
    type: [ConversationDto],
    description: 'List of all conversations',
  })
  getAllConversations(): Promise<ConversationDto[]> {
    return this.supportChatService.getAllConversations();
  }

  @Get('conversations/:id/messages')
  @ApiParam({ name: 'id', type: String, description: 'Conversation ID' })
  @ApiOkResponse({
    type: [ConversationMessageDto],
    description: 'Messages in a conversation',
  })
  getMessages(@Param('id') id: string): Promise<ConversationMessageDto[]> {
    return this.supportChatService.getMessages(id);
  }
}
