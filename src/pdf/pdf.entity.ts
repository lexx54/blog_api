import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PDFEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // Tipo de PDF: pasaporte, vida laboral, etc.

  @Column()
  path: string; // Ruta del PDF

  // @ManyToOne(() => ClientEntity, (client) => client.pdfs)
  // client: ClientEntity;
}
