import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Product } from '../product/entities/product.entity';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
