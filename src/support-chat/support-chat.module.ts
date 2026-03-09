import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { Conversation } from './entities/conversation.entity';
import { ConversationMessage } from './entities/conversation-message.entity';
import { SupportChatService } from './support-chat.service';
import { SupportChatGateway } from './support-chat.gateway';
import { SupportChatController } from './support-chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationMessage]),
    AuthModule,
    UserModule,
    TelegramModule,
  ],
  providers: [SupportChatService, SupportChatGateway],
  controllers: [SupportChatController],
})
export class SupportChatModule {}
