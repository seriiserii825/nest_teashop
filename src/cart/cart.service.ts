import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  // get or create cart for user
  private async getOrCreateCart(user_id: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: user_id } },
    });
    if (!cart) {
      cart = this.cartRepo.create({ user: { id: user_id } });
      await this.cartRepo.save(cart);
    }
    return cart;
  }

  async getCart(user_id: number): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: user_id } },
      relations: { items: { product: true } },
    });
    if (!cart) return this.getOrCreateCart(user_id);
    return cart;
  }

  async addItem(user_id: number, dto: AddCartItemDto): Promise<CartItem> {
    const cart = await this.getOrCreateCart(user_id);

    // if product already in cart — increase quantity
    const existing = await this.cartItemRepo.findOne({
      where: { cart: { id: cart.id }, product: { id: dto.product_id } },
    });

    if (existing) {
      existing.quantity += dto.quantity;
      return this.cartItemRepo.save(existing);
    }

    const item = this.cartItemRepo.create({
      cart: { id: cart.id },
      product: { id: dto.product_id },
      quantity: dto.quantity,
    });
    return this.cartItemRepo.save(item);
  }

  async updateItem(
    user_id: number,
    itemId: number,
    dto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cart: { user: { id: user_id } } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    item.quantity = dto.quantity;
    return this.cartItemRepo.save(item);
  }

  async removeItem(user_id: number, itemId: number): Promise<void> {
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cart: { user: { id: user_id } } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartItemRepo.remove(item);
  }

  async clearCart(user_id: number): Promise<void> {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: user_id } },
      relations: { items: true },
    });
    if (!cart) return;
    await this.cartItemRepo.remove(cart.items);
  }
}
