import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Review } from 'src/review/entities/review.entity';
import { Store } from 'src/store/entities/store.entity';

export class TCreateUserDto {
  @ApiPropertyOptional({ minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class TUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty()
  picture: string;

  @ApiProperty({ type: [Store] })
  stores: Store[];

  @ApiProperty({ type: [Review] })
  reviews: Review[];

  @ApiProperty({ type: [Product] })
  favorites: Product[];

  @ApiProperty({ type: [Order] })
  orders: Order[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class IUserFavorite {
  @ApiProperty()
  message: string;

  @ApiProperty()
  isFavorite: boolean;
}
