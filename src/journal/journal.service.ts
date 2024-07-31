import {
  BadRequestException,
  Injectable,
  ValidationError,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalEntity } from './journal.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { extname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntity)
    private readonly journalRepository: Repository<JournalEntity>,
  ) {}

  async findAll(page: number, limit: number): Promise<JournalEntity[]> {
    try {
      const journals = await this.journalRepository
        .createQueryBuilder('journal')
        .leftJoin('journal.auth', 'auth')
        .select([
          'journal.id',
          'journal.title',
          'journal.description',
          'journal.start',
          'journal.end',
          // Seleccionando todos los campos de 'auth' excepto 'password'
          'auth.id',
          'auth.username',
          'auth.imagePath',
          'auth.created_at',
          'auth.updated_at',
        ])
        .take(limit)
        .skip((page - 1) * limit)
        .getMany();

      return journals;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<JournalEntity | undefined> {
    return await this.journalRepository.findOne({ where: { id } });
  }

  async create(
    journal: JournalEntity,
  ): Promise<JournalEntity | ValidationError[]> {
    try {
      const newJournal = this.journalRepository.create(journal);

      const errors = await validate(newJournal);

      if (errors.length > 0) {
        return errors;
      }

      return await this.journalRepository.save(newJournal);
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updatedNewJournal: JournalEntity): Promise<JournalEntity> {
    await this.journalRepository.update(id, updatedNewJournal);
    return await this.findById(id);
  }

  async delete(id: number): Promise<JournalEntity> {
    const journalToDelete = await this.findById(id);
    await this.journalRepository.delete(id);
    return journalToDelete;
  }

}
