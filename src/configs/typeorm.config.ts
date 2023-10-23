import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { Like } from "@src/post/entities/like.entity";
import { Post } from "@src/post/entities/post.entity";
import { UserRelation } from "@src/user/entities/user-relation.entity";
import { User } from "@src/user/entities/user.entity";


export const typeormConfig: TypeOrmModuleAsyncOptions = {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => {

      const logger = new Logger("InstanceLoader");
      logger.verbose("Typeorm module configured")

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
        //TODO: disable DB syncronization in Production
        synchronize: true,
      };
    }
  }