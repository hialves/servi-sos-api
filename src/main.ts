import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { generateFolders } from './infra/persistence/asset/generate-folders';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';

async function bootstrap() {
  generateFolders();
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors({ origin: '*' });
  app.use(json({ limit: '10mb' }));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Template Backend REST')
    .setDescription('Template API')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = configService.get('SWAGGER_PATH');
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port, async () => {
    Logger.log(`Listening for API calls on \x1b[33m${await app.getUrl()} 💻\x1b[37m`, 'API');
    Logger.log(`Swagger documentation on \x1b[33m${await app.getUrl()}/${swaggerPath} 💻\x1b[37m`, 'API');
  });
}

bootstrap();
