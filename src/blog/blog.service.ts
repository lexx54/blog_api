import {
  BadRequestException,
  Injectable,
  ValidationError,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { extname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) { }

  async findAll(page: number, limit: number, showApproved: string, category: string): Promise<BlogEntity[]> {
    try {
      let clients;
      const query = this.blogRepository.createQueryBuilder('blog')

      if (showApproved && showApproved === 'true') query.where({ isApproved: true })
      if (showApproved && showApproved === 'false') query.where({ isApproved: false })
      if (category && category !== 'ALL') query.andWhere({ category })

      clients = await query.leftJoin('blog.auth', 'auth')
        .select([
          'blog.id',
          'blog.en_title',
          'blog.es_title',
          'blog.ca_title',
          'blog.en_content',
          'blog.es_content',
          'blog.ca_content',
          'blog.category',
          'blog.contact',
          'blog.name',
          'blog.isApproved',
          'blog.imagePath',
          'blog.created_at',
          'blog.updated_at',
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

      return clients;
    } catch (error) {
      throw error;
    }
  }

  async findNumber(type: string) {
    if (type && type === 'all') return await this.blogRepository.count()
    return await this.blogRepository.count({ where: { isApproved: false } })
  }

  async findById(id: number): Promise<BlogEntity | undefined> {
    return await this.blogRepository.findOne({ where: { id } });
  }

  async create(
    newsletter: BlogEntity,
  ): Promise<BlogEntity | ValidationError[]> {
    try {
      const newNewsletter = this.blogRepository.create(newsletter);

      const errors = await validate(newNewsletter);

      if (errors.length > 0) {
        return errors;
      }

      return await this.blogRepository.save(newNewsletter);
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updatedNewsletter: Partial<BlogEntity>): Promise<BlogEntity> {
    await this.blogRepository.update(id, updatedNewsletter);
    return await this.findById(id);
  }

  async delete(id: number): Promise<BlogEntity> {
    const newsletterToDelete = await this.findById(id);
    await this.blogRepository.delete(id);
    return newsletterToDelete;
  }

  async handleFileUpload(file: Express.Multer.File, blogId: number) {
    try {
      const newsletter = await this.blogRepository.findOne({
        where: { id: blogId },
      });

      if (!newsletter) {
        throw new BadRequestException(
          'El ID de Blog proporcionado no existe: ' + blogId,
        );
      }

      const folderPath = `./public/blog/${newsletter.id}`;
      const uniqueSuffix = `${Date.now()}`;
      const extension = extname(file.originalname);

      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
      }

      const fileName = `${uniqueSuffix}${extension}`;
      const filePath = `${folderPath}/${fileName}`;

      writeFileSync(filePath, file.buffer);

      await this.blogRepository.update(blogId, {
        imagePath: filePath,
      });

      return {
        success: true,
        filePath,
        fileName,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: error.message || 'Ha ocurrido un error al manejar el archivo.',
      });
    }
  }
}
