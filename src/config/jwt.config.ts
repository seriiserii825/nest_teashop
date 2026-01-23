import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default function getJwtConfig(
  configService: ConfigService,
): JwtModuleOptions {
  return {
    secret: configService.get<string>('JWT_SECRET'),
  };
}
