import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { TelegramService } from 'src/telegram/telegram.service';

interface CreateMessageDto {
  text: string;
  authorName: string;
  authorEmail: string | undefined;
  isAnonymous: boolean;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly telegramService: TelegramService,
  ) {}

  // Сохранить новое сообщение
  async createMessage(dto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create(dto);
    await this.telegramService.sendMessageToUser(
      `New message from ${dto.authorName}: ${dto.text}`,
    );
    return this.messageRepository.save(message);
  }

  // Получить последние 50 сообщений (для истории при подключении)
  async getMessages(): Promise<Message[]> {
    return this.messageRepository.find({
      order: { createdAt: 'ASC' },
      take: 50,
    });
  }

  async getUnreadCount(): Promise<number> {
    return this.messageRepository.count({ where: { isRead: false } });
  }

  async markAllAsRead(): Promise<void> {
    await this.messageRepository.update({ isRead: false }, { isRead: true });
  }
}
