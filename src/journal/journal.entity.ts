import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { AuthEntity } from 'src/auth/auth.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class JournalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'Debe seleccionar un cliente' })
  @Column()
  title: string;

  @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
  @Column()
  description: string;

  @Column()
  start: string;
  
  @Column()
  end: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // RELACIONES
  @ManyToOne(() => AuthEntity, (auth) => auth.clients)
  @JoinColumn()
  @IsNumber({}, { message: 'El ID de AuthEntity debe ser un número' })
  @IsPositive({ message: 'El ID de AuthEntity debe ser un número positivo' })
  @IsNotEmpty({ message: 'El ID de AuthEntity es requerido' })
  auth: AuthEntity;
}
