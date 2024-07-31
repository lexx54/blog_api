import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El nombre solo puede contener letras y números',
  })
  @Column()
  name: string;

  @Column()
  @IsNotEmpty({ message: 'El correo no puede estar vacío' })
  @IsEmail({}, { message: 'El formato del correo electrónico es inválido' })
  email: string;

  @IsNotEmpty({ message: 'El asunto no puede estar vacío' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El asunto solo puede contener letras y números',
  })
  @Column()
  subject: string;

  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El mensaje solo puede contener letras y números',
  })
  @Column({ length: 1 })
  message: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
