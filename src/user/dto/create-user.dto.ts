import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'name@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword123' })
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
