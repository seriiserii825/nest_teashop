import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    required: false,
    type: [String],
    description: 'Array of existing image URLs to keep',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  old_images?: string[];
}
