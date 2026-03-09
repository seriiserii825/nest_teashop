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
import { ChatService } from './chat.service';

interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  // Определяем пользователя из токена
  private getUserFromSocket(client: Socket): JwtPayload | null {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) return null;

      const payload = this.jwtService.verify(token);
      return payload; // { id, email, name, ... }
    } catch {
      return null;
    }
  }

  // Клиент подключился
  async handleConnection(client: Socket) {
    const user = this.getUserFromSocket(client);
    console.log(`Connected: ${client.id} | ${user?.email ?? 'Аноним'}`);

    // Отправляем историю сообщений только этому клиенту
    const messages = await this.chatService.getMessages();
    client.emit('history', messages);
  }

  // Клиент отключился
  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  // Клиент отправил сообщение
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() text: string,
  ) {
    const user = this.getUserFromSocket(client);

    const message = await this.chatService.createMessage({
      text,
      authorName: user?.name ?? 'Аноним',
      authorEmail: user?.email ?? undefined,
      isAnonymous: !user,
    });

    // Отправляем сообщение всем подключённым клиентам
    this.server.emit('newMessage', message);
  }
}
