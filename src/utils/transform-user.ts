// utils/transform-user.ts

import { TUserResponseDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';

export function transformUserToDto(user: User): TUserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
