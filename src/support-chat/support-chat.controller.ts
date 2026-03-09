import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Admin } from 'src/auth/decorators/admin.decorator';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { SupportChatService } from './support-chat.service';
import { Conversation } from './entities/conversation.entity';
import { ConversationMessage } from './entities/conversation-message.entity';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Admin()
@AuthJwt()
@Controller('support-chat')
export class SupportChatController {
  constructor(private readonly supportChatService: SupportChatService) {}

  @Get('conversations')
  @ApiOkResponse({ type: [Conversation] })
  getAllConversations(): Promise<Conversation[]> {
    return this.supportChatService.getAllConversations();
  }

  @Get('conversations/:id/messages')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: [ConversationMessage] })
  getMessages(
    @Param('id') id: string,
  ): Promise<ConversationMessage[]> {
    return this.supportChatService.getMessages(id);
  }
}
