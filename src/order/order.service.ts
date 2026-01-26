import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user_id: number) {
    const order_items = createOrderDto.items.map((item) => {
      return {
        quantity: item.quantity,
        price: item.price,
        product_id: item.product_id,
        store_id: item.store_id,
        user_id: user_id,
      };
    });

    const total = order_items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const newOrder = {
      status: OrderStatus.PENDING,
      user_id: user_id,
      orderItems: order_items,
      total: total,
    };

    const savedOrder = await this.orderRepository.save(newOrder);
    const order_items_with_order_id = order_items.map((item) => {
      return { ...item, order_id: savedOrder.id };
    });
    await this.orderItemRepository.save(order_items_with_order_id);
  }

  findAll(user_id: number) {
    return this.orderRepository.find({
      where: { user_id: user_id },
      relations: ['items'],
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
