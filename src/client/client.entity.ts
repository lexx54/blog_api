import { Controller } from '@nestjs/common';

@Controller('client')
export class ClientController { }
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  // OneToMany,
} from 'typeorm';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AuthEntity } from 'src/auth/auth.entity';
import {
  CollaboratorsDto,
  DuesDto,
  PaymentStatus,
  PdfDto,
  TramiteType,
} from './client.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
// import { PDFEntity } from 'src/pdf/pdf.entity';

@Entity()
export class ClientEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @ApiProperty()
  @Column()
  @IsEmail({}, { message: 'El formato del correo electrónico es inválido' })
  email: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  address: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty({ message: 'El teléfono principal es obligatorio' })
  // @Matches(/^(\+(34)\s?)?\d{9}$|^(\+(1)\s?)?\d{10}$/, {
  //   message:
  //     'Por favor, introduce un número de teléfono válido de España (+34XXXXXXXXX) o Estados Unidos (+1XXXXXXXXXX)',
  //   context: '',
  // })
  mainPhone: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  // @Matches(/^(\+(34)\s?)?\d{9}$|^(\+(1)\s?)?\d{10}$/, {
  //   message:
  //     'Por favor, introduce un número de teléfono válido de España (+34XXXXXXXXX) o Estados Unidos (+1XXXXXXXXXX)',
  // })
  secondaryPhone: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  category: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsNumber()
  // @IsPositive({ message: 'El precio cotizado debe ser un número positivo' })
  // @Min(100, { message: 'El precio cotizado debe ser mayor que 100' })
  priceQuote: number;

  @ApiProperty()
  @Column({ nullable: true })
  @IsNumber()
  // @IsPositive({ message: 'El precio debe ser un número positivo' })
  // @Min(100, { message: 'El precio debe ser mayor que 100' })
  price: number;

  @Column({ type: 'json', nullable: true })
  // @IsArray({ message: 'No es una lista' })
  // @ValidateNested({ each: true })
  @ApiProperty({ type: [PdfDto] })
  @Type(() => PdfDto)
  pdf: PdfDto[];

  @Column({ type: 'json' })
  @ApiProperty({ type: DuesDto })
  @Type(() => DuesDto)
  dues: string = 'null';



  @Column({ type: 'json' })
  @ApiProperty({ type: CollaboratorsDto })
  @Type(() => CollaboratorsDto)
  collaborators: string;

  @ApiProperty()
  @Column({ default: '' })
  // @IsIn(['TYPE1', 'TYPE2', 'TYPE3', 'TYPE4'] as TramiteType[], {
  //   message: `El tipo de trámite es inválido - 'TYPE1', 'TYPE2', 'TYPE3', 'TYPE4'`,
  // })
  tramiteType: string;
  // tramiteType: TramiteType;/

  @ApiProperty()
  @Column({ default: 'PENDING' })
  @IsIn(['PENDING', 'PAID', 'NONE'] as PaymentStatus[], {
    message: 'El estado de pago es inválido - PENDING, PAID, NONE',
  })
  paymentStatus: PaymentStatus;

  // FECHA
  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty()
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

  // Relación uno a muchos con los PDF
  // @OneToMany(() => PDFEntity, (pdf) => pdf.client)
  // pdfs: PDFEntity[];
}
