import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Logger, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from './app.config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UserRelation } from './user/entities/user-relation.entity';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity'
import { Like } from './post/entities/like.entity';
import { TokenDecoderMiddleware } from './middlewares/token-decoder.middleware';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';
import { typeormConfig } from './configs/typeorm.config';
import { jwtModuleConfig } from './configs/jwt-module.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeormConfig),
    JwtModule.registerAsync(jwtModuleConfig),
    UserModule,
    PostModule
    ],
  controllers: [AppController],
  providers: [AppService, AppConfig],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenDecoderMiddleware)
      .forRoutes(UserController, PostController);
  }
}