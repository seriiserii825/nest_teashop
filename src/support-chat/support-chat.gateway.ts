import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/enums/user-role.enum';
import { SupportChatService } from './support-chat.service';
import { Conversation } from './entities/conversation.entity';

const ADMIN_ROOM = 'support:admin';

interface SocketMeta {
  conversation: Conversation | null;
  isAdmin: boolean;
}

@WebSocketGateway({
  namespace: '/support',
  cors: {
    origin: (
      origin: string,
      callback: (err: Error | null, allow: boolean) => void,
    ) => {
      const allowed = [
        process.env.CLIENT_URL,
        process.env.CLIENT_URL_DEVELOPMENT,
      ].filter(Boolean);
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`), false);
      }
    },
    credentials: true,
  },
})
export class SupportChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private socketMeta = new Map<string, SocketMeta>();

  constructor(
    private readonly supportChatService: SupportChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private getUserIdFromSocket(client: Socket): number | null {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) return null;
      const payload = this.jwtService.verify<{ id: number }>(token);
      return payload.id ?? null;
    } catch {
      return null;
    }
  }

  async handleConnection(client: Socket) {
    const userId = this.getUserIdFromSocket(client);

    if (userId) {
      try {
        const user = await this.userService.findOne(userId);

        if (user.role === UserRole.ADMIN) {
          await client.join(ADMIN_ROOM);
          this.socketMeta.set(client.id, { conversation: null, isAdmin: true });
          console.log(`[SupportChat] Admin connected: ${client.id}`);
          return;
        }

        const conversation =
          await this.supportChatService.findOrCreateByUser(user);
        await client.join(`conv:${conversation.id}`);
        this.socketMeta.set(client.id, { conversation, isAdmin: false });

        const messages = await this.supportChatService.getMessages(
          conversation.id,
        );
        client.emit('history', { conversationId: conversation.id, messages });
        return;
      } catch {
        console.error(`[SupportChat] User ${userId} not found`);
      }
    }

    // Anonymous guest
    const conversationId = client.handshake.query?.conversationId as
      | string
      | undefined;
    const guestName = client.handshake.query?.guestName as string | undefined;
    const guestEmail = client.handshake.query?.guestEmail as string | undefined;

    let conversation: Conversation | null = null;

    if (conversationId) {
      conversation =
        await this.supportChatService.findConversationById(conversationId);
    }

    if (!conversation) {
      conversation = await this.supportChatService.createGuestConversation(
        guestName,
        guestEmail,
      );
    }

    await client.join(`conv:${conversation.id}`);
    this.socketMeta.set(client.id, { conversation, isAdmin: false });

    const messages = await this.supportChatService.getMessages(conversation.id);
    client.emit('history', { conversationId: conversation.id, messages });
    console.log(`[SupportChat] Guest connected: ${client.id} | conv: ${conversation.id}`);
  }

  handleDisconnect(client: Socket) {
    this.socketMeta.delete(client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleUserMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() text: string,
  ) {
    const meta = this.socketMeta.get(client.id);
    if (!meta || meta.isAdmin || !meta.conversation) return;

    const message = await this.supportChatService.addMessage(
      meta.conversation,
      text,
      false,
    );

    const payload = { conversationId: meta.conversation.id, message };
    this.server.to(`conv:${meta.conversation.id}`).emit('newMessage', payload);
    this.server.to(ADMIN_ROOM).emit('newMessage', payload);
  }

  @SubscribeMessage('adminReply')
  async handleAdminReply(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { conversationId: string; text: string },
  ) {
    const meta = this.socketMeta.get(client.id);
    if (!meta?.isAdmin) return;

    const conversation = await this.supportChatService.findConversationById(
      body.conversationId,
    );
    if (!conversation) return;

    const message = await this.supportChatService.addMessage(
      conversation,
      body.text,
      true,
    );

    const payload = { conversationId: body.conversationId, message };
    this.server.to(`conv:${body.conversationId}`).emit('newMessage', payload);
    this.server.to(ADMIN_ROOM).emit('newMessage', payload);
  }
}
