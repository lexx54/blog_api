import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from './contact.entity';
import { Repository } from 'typeorm';
import { ValidationError, validate } from 'class-validator';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async findAll(): Promise<ContactEntity[]> {
    try {
      return await this.contactRepository.find();
    } catch (error) {
      return error;
    }
  }

  async findById(id: number): Promise<ContactEntity | undefined> {
    return await this.contactRepository.findOne({ where: { id } });
  }

  async create(
    contact: ContactEntity,
  ): Promise<ContactEntity | ValidationError[]> {
    try {
      const form = new ContactEntity();
      form.name = contact.name;
      form.subject = contact.subject;
      form.message = contact.message;
      form.email = contact.email;
      const errors = await validate(form);

      if (errors.length > 0) {
        return errors;
      }

      return await this.contactRepository.save(form);
    } catch (error) {
      return error;
    }
  }

  async update(
    id: number,
    updatedNewsletter: ContactEntity,
  ): Promise<ContactEntity> {
    try {
      await this.contactRepository.update(id, updatedNewsletter);
      return await this.findById(id);
    } catch (error) {
      return error;
    }
  }

  async delete(id: number): Promise<ContactEntity> {
    try {
      const newsletterToDelete = await this.findById(id);
      await this.contactRepository.delete(id);
      return newsletterToDelete;
    } catch (error) {
      return error;
    }
  }
}
