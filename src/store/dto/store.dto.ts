import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({ minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @ApiPropertyOptional({ minLength: 10 })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;
}

export class StoreResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class StoreRemoveResponseDto {
  @ApiProperty({ example: 'Store with id 4 removed successfully' })
  message: string;
}
