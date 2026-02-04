import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreService } from 'src/store/store.service';
import { Not, Repository } from 'typeorm';
import {
  CategoryBasicDto,
  CategoryWithProductsCountDto,
  CreateCategoryDto,
} from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private storeService: StoreService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    store_id: number,
    user_id: number,
  ): Promise<CategoryBasicDto> {
    await this.storeService.findOne(store_id, user_id);
    await this.hasTheSameTitleInStore(createCategoryDto.title, store_id);
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      store_id,
    });
    return this.categoryRepository.save(category);
  }

  async findAll(store_id: number): Promise<CategoryBasicDto[]> {
    return this.categoryRepository.find({
      where: { store_id },
      relations: ['store'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number, store_id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, store_id },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with id ${id} not found in your store`,
      );
    }
    return category;
  }

  async findAllWithProductsCount(
    store_id: number,
  ): Promise<CategoryWithProductsCountDto[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.store_id = :store_id', { store_id })
      .loadRelationCountAndMap('category.products_count', 'category.products')
      .orderBy('category.updatedAt', 'DESC')
      .getMany();
    return categories as unknown as CategoryWithProductsCountDto[];
  }

  async update(
    id: number,
    store_id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryBasicDto> {
    if (updateCategoryDto.title) {
      await this.hasTheSameTitleInStoreWithoutCurrent(
        updateCategoryDto.title,
        store_id,
        id,
      );
    }
    const category = await this.findOne(id, store_id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number, store_id: number): Promise<CategoryBasicDto> {
    const category = await this.findOne(id, store_id);
    return this.categoryRepository.remove(category);
  }

  async hasTheSameTitleInStore(title: string, store_id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { title, store_id },
    });
    if (category) {
      throw new ConflictException(
        `Category '${title}' already exists in your store`,
      );
    }
  }

  async hasTheSameTitleInStoreWithoutCurrent(
    title: string,
    store_id: number,
    category_id: number,
  ): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { title, store_id, id: Not(category_id) },
    });
    if (category) {
      throw new ConflictException(
        'Category title already exists in your store',
      );
    }
  }
}
