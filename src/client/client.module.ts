import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity]), AuthModule],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientModule],
})
export class ClientModule {}
