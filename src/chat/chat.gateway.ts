import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatEntity } from './chat.entity';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {
    this.server = new Server({
      cors: {
        origin: true,
        credentials: true,
      },
    });
  }
  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      console.log('is Conecting')
      try {
        const { authId } = socket.handshake.auth;

        if (!authId) {
          socket.disconnect();
          return;
        }
        await this.authService.update(authId, { online: true });
        // this.server.emit('on-auth', await this.authService.findAll());

        // console.log(await this.chatService.findAll(1, 0));

        this.server.emit('on-auth-change', await this.chatService.getAuthAll());
        this.server.emit('on-message', await this.chatService.findAll(1, 0));

        socket.on('disconnect', async () => {
          await this.authService.update(authId, { online: false });
          this.server.emit('on-auth-change', this.chatService.getAuthAll());
        });
      } catch (error) {
        socket.emit('error-message', {
          message: 'Se ha producido un error.',
          error,
        });
        console.log(error);
      }
    });
  }

  @SubscribeMessage('send-message')
  async handleMessage(@MessageBody(new ValidationPipe()) chat: ChatEntity) {
    try {
      await this.chatService.createChat(chat);
      this.server.emit('on-message', await this.chatService.findAll(1, 0));

      if (!chat) {
        return;
      }
    } catch (error) {
      this.server.emit('error-message', {
        message: 'Se ha producido un error.',
        error,
      });
      console.log(error);
      return error;
    }
  }
  @SubscribeMessage('delete-messages')
  async deleteMessages() {
    try {
      await this.chatService.deleteAllChat();

    } catch (error) {
      this.server.emit('error-message', {
        message: 'Se ha producido un error.',
        error,
      });
      console.log(error);
      return error;
    }
  }
}
