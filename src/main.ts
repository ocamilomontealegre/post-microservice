import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { say } from 'cowsay';
import { PostModule } from './modules/post.module';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3002;
  const logger = new Logger('Main');

  const options = new DocumentBuilder()
    .setTitle('Post Microservice')
    .setDescription('Post microservice for the social network app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  logger.log(`Swagger live on http://localhost:${PORT}/api`);

  await app.listen(PORT, (): void =>
    console.log(
      say({
        text: `Server listening on port http://localhost:${PORT}`,
        e: 'oO',
        T: 'U ',
      }),
    ),
  );
}
bootstrap();
