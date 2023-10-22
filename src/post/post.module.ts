import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@src/user/jwt.strategy';
import { Like } from './entities/like.entity';
import { User } from '@src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_TOKEN_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRATION'),
          },
        };
      },
    }),
  ],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class PostModule {}
