import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto, user_id: number) {
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

    return this.orderRepository.save(newOrder);
  }

  findAll() {
    return this.orderRepository.find({ relations: ['orderItems'] });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['orderItems'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
