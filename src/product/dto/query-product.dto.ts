import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryProductDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortKey?: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    required: false,
    description: 'Filter by category IDs (comma-separated)',
    example: '1,2,3',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? value.split(',').map(Number) : value;
  })
  category_ids?: number[];

  @ApiProperty({ required: false, description: 'Minimum price', example: 10 })
  @IsOptional()
  @Type(() => Number)
  price_min?: number;

  @ApiProperty({ required: false, description: 'Maximum price', example: 10 })
  @IsOptional()
  @Type(() => Number)
  price_max?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by color ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  color_id?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by minimum star rating',
    example: 4,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stars?: number;
}
