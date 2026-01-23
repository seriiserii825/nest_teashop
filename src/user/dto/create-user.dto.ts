import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 'name@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword123', minimum: 6 })
  @MinLength(6)
  @IsString()
  password: string;

  @ApiProperty({ example: '/uploads/picture.jpg' })
  @IsString()
  picture: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsString()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-02T00:00:00Z' })
  @IsString()
  updatedAt: Date;
}

export class CreateUserDto extends PickType(UserDto, [
  'name',
  'email',
  'password',
]) {}

export class UserResponseDto extends PickType(UserDto, [
  'id',
  'name',
  'email',
  'picture',
  'createdAt',
  'updatedAt',
]) {}
