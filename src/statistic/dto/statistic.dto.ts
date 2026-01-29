import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

// Определяем возможные ID как константы
export const STATISTIC_IDS = [
  'revenue',
  'products',
  'categories',
  'colors',
  'reviews',
  'rating',
] as const;

export type StatisticId = (typeof STATISTIC_IDS)[number];

export class StatisticItemDto {
  @ApiProperty({
    enum: STATISTIC_IDS,
    example: STATISTIC_IDS,
    description: 'Statistic identifier',
  })
  @IsString()
  @IsIn(STATISTIC_IDS)
  id: StatisticId;

  @ApiProperty({
    example: 'Total Revenue',
    description: 'Statistic name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1360,
    description: 'Statistic value',
  })
  @IsNumber()
  value: number;
}
