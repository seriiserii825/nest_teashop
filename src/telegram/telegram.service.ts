import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly user_id: number;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly configService: ConfigService,
  ) {
    this.user_id = this.configService.get<number>('TELEGRAM_CHAT_ID')!;
  }

  async sendMessageToUser(message: string) {
    await this.bot.telegram.sendMessage(this.user_id, message);
  }
}
