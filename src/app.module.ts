import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';


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
          entities: [Role, User],
          //TODO: disable DB syncronization
          synchronize: true,
        };
      }
    }),
    UserModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
