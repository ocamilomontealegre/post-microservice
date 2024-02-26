import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { say } from 'cowsay';
import { PostModule } from './modules/post.module';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3002;

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
