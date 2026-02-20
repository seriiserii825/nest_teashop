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
import { CartBaseDto } from 'src/cart/dto/create-cart.dto';
import { OrderBasicDto } from 'src/order/dto/create-order.dto';
import { ProductBasicDto } from 'src/product/dto/create-product.dto';
import { ReviewBasicDto } from 'src/review/dto/create-review.dto';
import { Review } from 'src/review/entities/review.entity';
import { StoreBasicDto } from 'src/store/dto/store.dto';
import { UserRole } from '../enums/user-role.enum';

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

  @ApiProperty({
    example: 'user',
    description: 'Role of the user',
    enum: UserRole,
  })
  @IsEnum(UserRole, { message: 'role must be either user or admin' })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    type: () => ReviewBasicDto,
    isArray: true,
    description: 'List of reviews made by the user',
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => ReviewBasicDto)
  reviews?: Review[];

  @ApiProperty({
    type: () => OrderBasicDto,
    isArray: true,
    description: 'List of orders made by the user',
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => OrderBasicDto)
  orders?: OrderBasicDto[];

  @ApiProperty({
    type: () => StoreBasicDto,
    isArray: true,
    description: 'List of stores owned by the user',
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => StoreBasicDto)
  stores?: StoreBasicDto[];

  @ApiProperty({
    type: () => ProductBasicDto,
    isArray: true,
    description: 'List of favorite products',
  })
  @ValidateNested()
  @Type(() => ProductBasicDto)
  favorite_products?: ProductBasicDto[];

  @ApiProperty({
    type: () => CartBaseDto,
    description: 'Cart of the user',
  })
  @IsOptional()
  @Type(() => CartBaseDto)
  cart?: CartBaseDto;
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
