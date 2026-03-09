import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationMessage } from './entities/conversation-message.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SupportChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(ConversationMessage)
    private readonly messageRepo: Repository<ConversationMessage>,
  ) {}

  async findOrCreateByUser(user: User): Promise<Conversation> {
    const existing = await this.conversationRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (existing) return existing;

    const conv = this.conversationRepo.create({
      user,
      isAnonymous: false,
    });
    return this.conversationRepo.save(conv);
  }

  async createGuestConversation(
    guestName?: string,
    guestEmail?: string,
  ): Promise<Conversation> {
    const conv = this.conversationRepo.create({
      guestName: guestName ?? 'Гость',
      guestEmail: guestEmail ?? null,
      isAnonymous: true,
    });
    return this.conversationRepo.save(conv);
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    return this.conversationRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async addMessage(
    conversation: Conversation,
    text: string,
    isFromAdmin: boolean,
  ): Promise<ConversationMessage> {
    const msg = this.messageRepo.create({ conversation, text, isFromAdmin });
    return this.messageRepo.save(msg);
  }

  async getMessages(conversationId: string): Promise<ConversationMessage[]> {
    return this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
      take: 100,
    });
  }

  // For admin: list all conversations with last message timestamp
  async getAllConversations(): Promise<Conversation[]> {
    return this.conversationRepo.find({
      relations: ['user'],
      order: { updatedAt: 'DESC' },
    });
  }
}
