import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, Matches } from 'class-validator';

export class ColorBasicDto {
  @ApiProperty({ example: 1, description: 'Color ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Red', description: 'Color Name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '#FF0000', description: 'Color Value in HEX format' })
  @IsString()
  @Matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/)
  value: string;

  @ApiProperty({ example: 1, description: 'Store ID' })
  @IsNumber()
  store_id: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Creation Date',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00Z',
    description: 'Last Update Date',
  })
  @IsDate()
  updatedAt: Date;
}

export class CreateColorBasicDto extends PickType(ColorBasicDto, [
  'name',
  'value',
]) {}
export class UpdateColorBasicDto extends PartialType(CreateColorBasicDto) {}
