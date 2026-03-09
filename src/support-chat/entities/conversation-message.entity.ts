import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('conversation_messages')
export class ConversationMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conv) => conv.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column('text')
  text: string;

  @Column({ default: false })
  isFromAdmin: boolean;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
