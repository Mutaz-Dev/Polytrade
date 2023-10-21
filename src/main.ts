import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from '@src/configs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(SERVER_PORT);
}
bootstrap();
