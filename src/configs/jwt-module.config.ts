import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";


export const jwtModuleConfig: JwtModuleAsyncOptions = {
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => {
    
    const logger = new Logger("InstanceLoader");
    logger.verbose("JWT module configured")

    return {
      secret: config.get<string>('JWT_TOKEN_SECRET'),
      signOptions: {
        expiresIn: config.get<string>('JWT_EXPIRATION'),
      },
    };
  },
}