import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsDate, IsNumber, IsString } from 'class-validator';

class Product {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Green Tea', description: 'Product Title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A refreshing green tea.',
    description: 'Product Description',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 9.99, description: 'Product Price' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'http://example.com/images/green-tea.jpg',
    description: 'Product Images URL',
  })
  @ArrayMinSize(1, { message: 'At least one image is required.' })
  images: string;

  @ApiProperty({ example: 1, description: 'Store ID' })
  @IsNumber()
  store_id: number;

  @ApiProperty({ example: 2, description: 'Category ID' })
  @IsNumber()
  category_id: number;

  @ApiProperty({ example: 3, description: 'Color ID' })
  @IsNumber()
  color_id: number;

  @ApiProperty({ example: 4, description: 'User ID' })
  @IsNumber()
  user_id: number;

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

export class CreateProductDto extends Product {}
