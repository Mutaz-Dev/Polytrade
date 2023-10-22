import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request as RequestType } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_TOKEN_SECRET'),
    });
  }

  private static extractJwtFromCookie(req: RequestType): string | null {
    console.log(req.cookies);
    if (req.cookies && 'token' in req.cookies) return req.cookies.token;
    return null;
  }
  async validate(payload: any) {
    return { id: payload.id, role: payload.role };
  }
}
