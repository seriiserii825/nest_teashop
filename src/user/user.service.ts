import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { Repository } from 'typeorm';
import { CreateUserDto, UserBasicDto, UserFavoriteDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private productService: ProductService,
  ) {}
  async create(input: CreateUserDto): Promise<UserBasicDto> {
    await this.userExists(input.email);
    const hashedPassword = await hash(input.password);
    const newUser = this.userRepository.create({
      ...input,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    delete (newUser as Partial<User>).password;
    return newUser;
  }

  async createForGoogle(input: Omit<CreateUserDto, 'password'>): Promise<User> {
    await this.userExists(input.email);
    const newUser = this.userRepository.create({
      ...input,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  findAll() {
    return this.userRepository.find({
      relations: ['stores', 'products', 'orders'],
    });
  }

  async findOne(id: number): Promise<UserBasicDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['stores', 'favorite_products', 'orders', 'cart'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByStoreFavorites(user_id: number): Promise<UserBasicDto> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: { favorite_products: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['stores', 'products', 'orders'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByEmailOrNull(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['stores', 'products', 'orders'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async userExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }

  async toggleFavorite(
    user_id: number,
    product_id: number,
  ): Promise<UserFavoriteDto> {
    const user = await this.findByStoreFavorites(user_id);
    // Проверяем существование продукта
    const product = await this.productService.findOne(product_id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!user.favorite_products) {
      throw new NotFoundException('User has no favorite products');
    }

    // // Проверяем, есть ли продукт в избранном
    const productIndex = user.favorite_products?.findIndex(
      (p) => p.id === product_id,
    );

    if (productIndex !== -1) {
      // Убираем из избранного
      user.favorite_products?.splice(productIndex, 1);
    } else {
      // Добавляем в избранное
      user.favorite_products?.push(product);
    }

    // Сохраняем изменения
    await this.userRepository.save(user);

    return {
      message:
        productIndex !== -1 ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: productIndex === -1,
    };
  }
}
