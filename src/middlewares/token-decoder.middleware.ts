import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt_decode from "jwt-decode";


@Injectable()
export class TokenDecoderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
      let token = (req.headers['x-access-token'] || req.headers['authorization'] )as String;
      token = token.replace(/^Bearer\s+/, "");
      const decodedToken: string = jwt_decode(req.headers.authorization as string);
      req.headers.decodedToken = decodedToken;
    }

    next();
  }
}