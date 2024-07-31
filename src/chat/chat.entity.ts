import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { AuthEntity } from 'src/auth/auth.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'El mensaje no puede ir vació' })
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  @MaxLength(20, {
    message: 'El nombre de usuario no puede tener más de 20 caracteres',
  })
  message: string;

  // FECHA
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // RELACIONES
  @ManyToOne(() => AuthEntity, (auth) => auth.chats)
  @JoinColumn()
  @IsNumber({}, { message: 'El ID de AuthEntity debe ser un número' })
  @IsPositive({ message: 'El ID de AuthEntity debe ser un número positivo' })
  @IsNotEmpty({ message: 'El ID de AuthEntity es requerido' })
  auth: AuthEntity;
}
