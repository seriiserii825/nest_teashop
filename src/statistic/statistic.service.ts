import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjsModule from 'dayjs';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
const dayjs = dayjsModule.default;

dayjs.locale('en');

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getMainStatistics(store_id: number) {
    const totalRevenue = await this.calculateTotalRevenue(store_id);
    const productsCount = await this.countProducts(store_id);
    const categoriesCount = await this.countCategories(store_id);
    const averageRating = await this.calculateAverageRating(store_id);
    const colorsCount = await this.countColors(store_id);
    const reviewsCount = await this.countReviews(store_id);
    return [
      { id: 'revenue', name: 'Total Revenue', value: totalRevenue },
      { id: 'products', name: 'Products Count', value: productsCount },
      { id: 'categories', name: 'Categories Count', value: categoriesCount },
      { id: 'colors', name: 'Colors Count', value: colorsCount },
      { id: 'reviews', name: 'Reviews Count', value: reviewsCount },
      { id: 'rating', name: 'Average Rating', value: averageRating },
    ];
  }

  async countReviews(store_id: number) {
    const reviews_count = await this.reviewRepository.count({
      where: { store_id: store_id },
    });
    return reviews_count;
  }

  async countColors(store_id: number) {
    const colors_count = await this.productRepository
      .createQueryBuilder('product')
      .select('COUNT(DISTINCT product.color_id)', 'count')
      .where('product.store_id = :store_id', { store_id })
      .getRawOne<{ count: string }>();

    return colors_count ? parseInt(colors_count.count, 10) : 0;
  }

  async getMiddleStatistics(store_id: number) {
    // const monthlySales = await this.calculateMonthlySales(store_id);
    const lastUsers = await this.getLastUsers(store_id);
    return { lastUsers };
  }

  private async calculateTotalRevenue(store_id: number) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item', 'item.store_id = :store_id', {
        store_id,
      })
      .select('SUM(item.price * item.quantity)', 'total')
      .getRawOne<{ total: string | null }>();

    return result?.total ? parseFloat(result.total) : 0;
  }
  private async countProducts(store_id: number) {
    const products_count = await this.productRepository.count({
      where: { store_id: store_id },
    });
    return products_count;
  }
  private async countCategories(store_id: number) {
    const categories_count = await this.categoryRepository.count({
      where: { store_id: store_id },
    });
    return categories_count;
  }

  private async calculateAverageRating(store_id: number) {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where({ store_id })
      .getRawOne<{ avg: string | null }>();

    return result?.avg ? parseFloat(result.avg) : null;
  }

  async calculateMonthlySales(store_id: number) {
    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();

    const salesRaw = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item', 'item.store_id = :store_id', {
        store_id,
      })
      .select('DATE(order.createdAt)', 'date')
      .addSelect('SUM(item.price * item.quantity)', 'total')
      .where('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; total: string }>();

    return salesRaw.map((row) => ({
      date: dayjs(row.date).format('YYYY-MM-DD'),
      total: parseFloat(row.total),
    }));
  }
  async getLastUsers(store_id: number) {
    const lastUsers = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.orders', 'order')
      .innerJoin('order.orderItems', 'item', 'item.store_id = :store_id', {
        store_id,
      })
      .leftJoinAndSelect('user.orders', 'userOrders')
      .leftJoinAndSelect(
        'userOrders.orderItems',
        'orderItem',
        'orderItem.store_id = :store_id',
        { store_id },
      )
      .orderBy('user.createdAt', 'DESC')
      .take(5)
      .select(['user', 'userOrders', 'orderItem.price', 'orderItem.quantity'])
      .getMany();

    return lastUsers.map((user) => {
      const lastOrder = user.orders[user.orders.length - 1];
      const total = lastOrder.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        total: total,
      };
    });
  }
}
