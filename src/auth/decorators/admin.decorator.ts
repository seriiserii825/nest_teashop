import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt.auth-guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export function Admin() {
  return applyDecorators(
    Roles(UserRole.ADMIN),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
