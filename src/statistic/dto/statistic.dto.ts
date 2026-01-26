import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StatisticItemDto {
  @ApiProperty({
    example: 'revenue',
    description: 'Statistic identifier',
  })
  @IsString()
  id: string;

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

export class StatisticsResponseDto {
  @ApiProperty({
    type: [StatisticItemDto],
    description: 'Array of statistics',
    isArray: true,
    example: [
      { id: 'revenue', name: 'Total Revenue', value: 1360 },
      { id: 'products', name: 'Products Count', value: 1 },
      { id: 'categories', name: 'Categories Count', value: 2 },
      { id: 'colors', name: 'Colors Count', value: 1 },
      { id: 'reviews', name: 'Reviews Count', value: 1 },
      { id: 'rating', name: 'Average Rating', value: 5 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticItemDto)
  statistics: StatisticItemDto[];
}
