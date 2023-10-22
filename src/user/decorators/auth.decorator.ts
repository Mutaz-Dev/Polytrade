import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { RolesEnum } from '@src/shared/constants/roles';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { ROLES_KEY } from './roles.decorator';


export function Auth(...roles: RolesEnum[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
