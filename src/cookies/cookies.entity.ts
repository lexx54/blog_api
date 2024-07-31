import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CookieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string; // Dirección IP del cliente

  @Column()
  userAgent: string; // User-Agent del cliente

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  acceptedAt: Date; // Fecha y hora de aceptación de las cookies
}
