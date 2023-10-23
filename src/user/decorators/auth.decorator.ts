import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';



export function Auth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
  );
}
