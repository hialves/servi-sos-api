import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { generateFolders } from './infra/persistence/asset/generate-folders';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
dayjs.extend(utc);
dayjs.extend(timezone);

async function bootstrap() {
  generateFolders();
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors({ origin: '*' });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Template Backend REST')
    .setDescription('Template API')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = configService.get('SWAGGER_PATH', 'docs');
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port, async () => {
    Logger.log(`Listening for API calls on \x1b[33m${await app.getUrl()} 💻\x1b[37m`, 'API');
    Logger.log(`Swagger documentation on \x1b[33m${await app.getUrl()}/${swaggerPath} 💻\x1b[37m`, 'API');
  });
}

bootstrap();
