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
import { UserRole } from 'src/user/enums/user-role.enum';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';

interface ChatUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

@WebSocketGateway({
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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, ChatUser>();

  constructor(
    private readonly chatService: ChatService,
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
    } catch (e) {
      console.error('[ChatGateway] JWT verify error:', e.message);
      return null;
    }
  }

  async handleConnection(client: Socket) {
    const userId = this.getUserIdFromSocket(client);

    if (userId) {
      try {
        const user = await this.userService.findOne(userId);
        const isAdmin = user.role === UserRole.ADMIN;
        this.connectedUsers.set(client.id, {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          isAdmin,
        });
        console.log(`Connected: ${client.id} | ${user.email}`);

        if (isAdmin) {
          const unreadCount = await this.chatService.getUnreadCount();
          client.emit('unreadCount', unreadCount);
        }
      } catch {
        console.log(`Connected: ${client.id} | user ${userId} not found`);
      }
    } else {
      console.log(`Connected: ${client.id} | Аноним`);
    }

    const messages = await this.chatService.getMessages();
    client.emit('history', messages);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    console.log(`Disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() text: string,
  ) {
    const user = this.connectedUsers.get(client.id) ?? null;

    const message = await this.chatService.createMessage({
      text,
      authorName: user?.name ?? 'Аноним',
      authorEmail: user?.email ?? undefined,
      isAnonymous: !user,
    });

    this.server.emit('newMessage', message);

    const unreadCount = await this.chatService.getUnreadCount();
    this.broadcastToAdmins('unreadCount', unreadCount);
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(@ConnectedSocket() client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (!user?.isAdmin) return;

    await this.chatService.markAllAsRead();
    this.broadcastToAdmins('unreadCount', 0);
  }

  private broadcastToAdmins(event: string, data: unknown) {
    for (const [socketId, user] of this.connectedUsers.entries()) {
      if (user.isAdmin) {
        this.server.to(socketId).emit(event, data);
      }
    }
  }
}
