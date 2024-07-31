import { Module } from '@nestjs/common';
import { CookiesController } from './cookies.controller';
import { CookiesService } from './cookies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieEntity } from './cookies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CookieEntity])],
  controllers: [CookiesController],
  providers: [CookiesService],
  exports: [CookiesService],
})
export class CookiesModule {}
