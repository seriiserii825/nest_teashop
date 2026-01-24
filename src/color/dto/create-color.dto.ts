import { PartialType, PickType } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, Matches } from 'class-validator';

class Color {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @Matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/)
  value: string;

  @IsNumber()
  store_id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class CreateColorDto extends PickType(Color, ['name', 'value']) {}
export class UpdateColorDto extends PartialType(CreateColorDto) {}

export class ColorResponseDto extends Color {}
