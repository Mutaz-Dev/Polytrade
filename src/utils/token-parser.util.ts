import { IToken } from "../shared/interfaces/toke.interface";


export function parseTokenString (token: any): IToken {
    return {
      id: token.id,
      iat: token.iat,
      exp: token.exp,
    }
  }