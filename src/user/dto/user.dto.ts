import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { OrderBasicDto } from 'src/order/dto/create-order.dto';
import { ProductBasicDto } from 'src/product/dto/create-product.dto';
import { ReviewBasicDto } from 'src/review/dto/create-review.dto';
import { Review } from 'src/review/entities/review.entity';
import { StoreBasicDto } from 'src/store/dto/store.dto';

export class UserBasicDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiPropertyOptional({ minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiPropertyOptional()
  name?: string;

  @ApiProperty({ format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'http://example.com/profile.jpg' })
  @IsString()
  picture: string;

  @ApiProperty({ example: 'user', description: 'Role of the user' })
  @IsEnum(['user', 'admin'], { message: 'role must be either user or admin' })
  @IsString()
  role: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateUserDto extends PickType(UserBasicDto, ['name', 'email']) {
  @ApiProperty({ minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UserFavoriteDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  isFavorite: boolean;
}

export class UserFullDto extends UserBasicDto {
  @ApiProperty({
    type: () => ReviewBasicDto,
    description: 'List of reviews made by the user',
  })
  @ValidateNested()
  @Type(() => ReviewBasicDto)
  reviews: Review[];

  @ApiProperty({
    type: () => ProductBasicDto,
    description: 'List of favorite products',
  })
  @ValidateNested()
  @Type(() => ProductBasicDto)
  favorites: ProductBasicDto[];

  @ApiProperty({
    type: () => OrderBasicDto,
    description: 'List of orders made by the user',
  })
  @ValidateNested()
  @Type(() => OrderBasicDto)
  orders: OrderBasicDto[];

  @ApiProperty({
    type: () => StoreBasicDto,
    description: 'List of stores owned by the user',
  })
  @ValidateNested()
  @Type(() => StoreBasicDto)
  store: StoreBasicDto[];
}
