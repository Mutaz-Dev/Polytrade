import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Logger } from '@nestjs/common';
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


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const logger = new Logger("InstanceLoader");
        logger.verbose("connecting to DB")

        return {
          type: 'postgres',
          database: config.get<string>('DB_NAME'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          ssl: false,
          connectTimeoutMS: config.get<number>('DB_TIMEOUT'),
          entities: [User, UserRelation, Post, Like],
          //TODO: disable DB syncronization
          synchronize: true,
        };
      }
    }),
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
    UserModule,
    PostModule
    ],
  controllers: [AppController],
  providers: [AppService, AppConfig],
})
export class AppModule {}
