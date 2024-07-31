import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: false,
      transformOptions: {
        enableImplicitConversion: false,
        excludeExtraneousValues: false,
      },
      validationError: { target: false },
    }),
  );

  // Verificar si estamos en modo de desarrollo antes de configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Blog services API')
    .setDescription('Descripción de tu API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.enableCors(corsOptions); // Habilitar CORS con las opciones especificadas
  app.use(cookieParser());
  await app.listen(Number(process.env.SERVER_PORT));
  console.log(`Backend PORT: ${await app.getUrl()}`);
  // Mostrar la URL de Swagger solo en modo de desarrollo

  console.log(`Swagger PORT: ${(await app.getUrl()) + '/doc'}`);
}
bootstrap();
