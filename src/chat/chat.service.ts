import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly authService: AuthService,
  ) { }

  async createChat(chat: Partial<ChatEntity>) {
    try {
      const newClient = this.chatRepository.create(chat);

      const errors = await validate(newClient);

      if (errors.length > 0) {
        return errors;
      }
      return await this.chatRepository.save(newClient);
    } catch (error) {
      return error;
    }
  }

  async getAuthAll() {
    // return Object.values(this.authclient);
    console.log('getAuthAll -------------------')
    return await this.authService.findAll(0, 0);
  }

  async findAll(page: number, limit: number): Promise<ChatEntity[]> {
    console.log('findAll ----------------------')

    try {
      const chats = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoin('chat.auth', 'auth')
        .select([
          'chat.id',
          'chat.message',
          'chat.created_at',
          'chat.updated_at',
          // Seleccionando todos los campos de 'auth' excepto 'password'
          'auth.id',
          'auth.username',
          'auth.created_at',
          'auth.updated_at',
        ])
        .orderBy('chat.created_at', 'ASC')
        .take(limit)
        .skip((page - 1) * limit)
        .getMany();

      return chats;
    } catch (error) {
      throw error;
    }
  }
  async deleteAllChat() {
    await this.chatRepository.clear()
    return "Chat eliminado"
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
