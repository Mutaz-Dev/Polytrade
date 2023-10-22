import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from './configs/config';
import { RoleAuthFilter, UnauthorizedAuthFilter } from './filters/auth.filter';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/internal.filter';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }));

  app.useGlobalFilters(new UnauthorizedAuthFilter(), new RoleAuthFilter(), new HttpExceptionFilter())

  await app.listen(SERVER_PORT);
}
bootstrap();
