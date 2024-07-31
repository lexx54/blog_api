/* eslint-disable @typescript-eslint/no-var-requires */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { NewsletterEntity } from './newsletter/newsletter.entity';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ConfigModule } from '@nestjs/config';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { ContactModule } from './contact/contact.module';
import { ContactEntity } from './contact/contact.entity';
import { CookiesModule } from './cookies/cookies.module';
import { CookiesMiddleware } from './cookies/cookies.middleware';
import { CookieEntity } from './cookies/cookies.entity';
import { AuthModule } from './auth/auth.module';
import { AuthEntity } from './auth/auth.entity';
import { ClientModule } from './client/client.module';
import { ClientEntity } from './client/client.entity';
import { PdfModule } from './pdf/pdf.module';
import { ChatModule } from './chat/chat.module';
import { ChatEntity } from './chat/chat.entity';
import { BlogModule } from './blog/blog.module';
import { BlogEntity } from './blog/blog.entity';
import { JournalEntity } from './journal/journal.entity';
import { JournalModule } from './journal/journal.module';
// require('dotenv').config();
import 'dotenv/config';
// import { config } from 'dotenv';

// config();
console.log('======= ', process.env.DB_PORT);
@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../', 'front/dist'),
    // }),
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        NewsletterEntity,
        ContactEntity,
        CookieEntity,
        AuthEntity,
        ClientEntity,
        ChatEntity,
        BlogEntity,
        JournalEntity,
      ], // Agrega tus entidades aquí
      synchronize: true, // Opcional: sincroniza automáticamente las entidades con la base de datos (cuidado en producción)
    }),
    NewsletterModule,
    ContactModule,
    CookiesModule,
    AuthModule,
    ClientModule,
    PdfModule,
    ChatModule,
    BlogModule,
    JournalModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookiesMiddleware).forRoutes('*');
  }
}
