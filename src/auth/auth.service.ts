import {
  BadRequestException,
  Injectable,
  ValidationError,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './auth.dto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname } from 'path';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) { }

  async update(
    id: number,
    authData: Partial<AuthEntity>,
  ): Promise<AuthEntity | undefined> {
    try {
      await this.authRepository.update(id, authData);
      return await this.authRepository.findOne({ where: { id } });
    } catch (error) {
      return error;
    }
  }

  async register(
    createUserDto: AuthCredentialsDto,
  ): Promise<AuthEntity | ValidationError[]> {
    const { username, password } = createUserDto;
    try {
      const adminExists = await this.isAdminExists();
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.authRepository.create({
        username,
        password: hashedPassword,
        rol: !adminExists ? 'ADMINISTRATOR' : 'CLIENT',
      });

      return await this.authRepository.save(newUser);
    } catch (error) {
      return error;
    }
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthEntity | null> {
    const user = await this.authRepository.findOne({ where: { username } });
    if (user && (await this.comparePassword(password, user.password))) {
      return user;
    }
    return null;
  }

  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async validateAuthEntity(authId: number): Promise<boolean> {
    const authEntity = await this.authRepository.findOne({
      where: { id: authId },
    });
    return !!authEntity; // Devuelve true si se encuentra la entidad, de lo contrario, devuelve false
  }

  async isAdminExists(): Promise<boolean> {
    const adminCount = await this.authRepository.count({
      where: { rol: 'ADMINISTRATOR' },
    });
    return adminCount > 0;
  }

  async delete(id: number): Promise<AuthEntity> {
    try {
      const authToRemove = await this.authRepository.findOne({
        where: { id },
      });

      return await this.authRepository.remove(authToRemove);
    } catch (error) {
      if (error.sql) throw new BadRequestException("El usuario posee algun chat/blog/cliente, por favor elimine la informacion relacionada al usuario antes de eliminarlo")
      throw new BadRequestException(
        'El ID de AuthEntity proporcionado no existe',
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    online?: string,
    activo?: string,
  ): Promise<AuthEntity[]> {
    try {
      const parsedOnline =
        online === 'true' ? true : online === 'false' ? false : undefined;
      const parsedActivo =
        activo === 'true' ? true : activo === 'false' ? false : undefined;

      const query = this.authRepository
        .createQueryBuilder('auth')
        .select([
          'auth.id',
          'auth.username',
          'auth.rol',
          'auth.online',
          'auth.activo',
          'auth.created_at',
          'auth.updated_at',
          'auth.imagePath',
        ])
        .skip((page - 1) * limit)
        .take(limit);

      if (parsedOnline !== undefined) {
        query.andWhere('auth.online = :online', {
          online: parsedOnline,
        });
      }

      if (parsedActivo !== undefined) {
        query.andWhere('auth.activo = :activo', {
          activo: parsedActivo,
        });
      }

      const clients = await query.getMany();
      return clients;
    } catch (error) {
      throw error;
    }
  }

  async handleFileUpload(file: Express.Multer.File, authId: number) {
    try {
      console.log(authId);
      const auth = await this.authRepository.findOne({
        where: { id: authId },
      });

      if (!auth) {
        throw new BadRequestException(
          'El ID de Auth proporcionado no existe: ' + authId,
        );
      }

      const folderPath = `./public/auth/${auth.id}`;
      const uniqueSuffix = `${Date.now()}`;
      const extension = extname(file.originalname);

      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
      }

      const fileName = `${uniqueSuffix}${extension}`;
      const filePath = `${folderPath}/${fileName}`;

      writeFileSync(filePath, file.buffer);

      await this.authRepository.update(authId, { imagePath: filePath });

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
