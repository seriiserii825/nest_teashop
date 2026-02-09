import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { path as rootPath } from 'app-root-path';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import {
  CreateProductDto,
  ProductBasicDto,
  ProductsPaginatedDto,
} from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Review } from '../review/entities/review.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly fileManagerService: FileManagerService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    store_id: number,
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    user_id: number,
  ) {
    await this.checkDuplicateTitleInStore(store_id, createProductDto.title);

    return this.executeInTransaction(async (queryRunner) => {
      // Создаем и сохраняем продукт без изображений
      const newProduct = this.productRepository.create({
        ...createProductDto,
        store_id,
        user_id,
        images: [],
      });
      const savedProduct = await queryRunner.manager.save(newProduct);

      //   Загружаем изображения через FileManagerService
      const uploadedImages = await this.fileManagerService.uploadMultipleFiles(
        files,
        `products/${savedProduct.id}`,
      );

      // Обновляем продукт с изображениями
      savedProduct.images = uploadedImages;
      return queryRunner.manager.save(savedProduct);
    });
  }

  async update(
    id: number,
    store_id: number,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ) {
    const product = await this.findOne(id, store_id);

    // Проверка на дубликат названия
    if (
      updateProductDto.title &&
      updateProductDto.title !== product.title &&
      product.store_id
    ) {
      await this.checkDuplicateTitleInStore(
        product.store_id,
        updateProductDto.title,
      );
    }

    return this.executeInTransaction(async (queryRunner) => {
      // Обновляем основные поля
      this.updateProductFields(product, updateProductDto);

      // 👇 Обрабатываем изображения через FileManagerService
      const { filesToKeep, filesToDelete } =
        this.fileManagerService.processFileUpdates(
          product.images,
          updateProductDto.old_images,
        );

      // // 👇 Объединяем старые и новые изображения
      product.images = await this.fileManagerService.mergeFiles(
        filesToKeep,
        files,
        `products/${product.id}`,
      );

      // Сохраняем продукт
      const updatedProduct = await queryRunner.manager.save(product);

      // // 👇 Удаляем старые файлы после успешного сохранения
      if (filesToDelete.length > 0) {
        await this.fileManagerService.deleteMultipleFiles(filesToDelete);
      }

      return updatedProduct;
    });
  }

  async remove(id: number, store_id: number) {
    const product = await this.findOne(id, store_id);

    // Удаляем все изображения продукта
    if (product.images.length > 0) {
      await this.deleteImageFiles(product.images);
    }

    return this.productRepository.delete(id);
  }

  // ==================== ПРИВАТНЫЕ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================

  /**
   * Выполняет операцию в транзакции с автоматической обработкой ошибок
   */
  private async executeInTransaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Operation failed: ${errorMessage}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Обновляет поля продукта из DTO
   */
  private updateProductFields(
    product: Product,
    updateDto: UpdateProductDto,
  ): void {
    if (updateDto.title !== undefined) product.title = updateDto.title;
    if (updateDto.description !== undefined)
      product.description = updateDto.description;
    if (updateDto.price !== undefined) product.price = updateDto.price;
    if (updateDto.category_id !== undefined)
      product.category_id = updateDto.category_id;
    if (updateDto.color_id !== undefined) product.color_id = updateDto.color_id;
  }

  /**
   * Удаляет файлы изображений с диска
   */
  private async deleteImageFiles(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        const filePath = join(rootPath, url);
        await unlink(filePath);
      } catch (error) {
        console.error(`Failed to delete image ${url}:`, error);
      }
    });

    await Promise.allSettled(deletePromises);
  }

  // ==================== ПУБЛИЧНЫЕ МЕТОДЫ ПОИСКА ====================

  async findAllArray(store_id: number) {
    return this.productRepository.find({
      where: { store_id },
      order: { updatedAt: 'DESC' },
    });
  }

  async findAll(
    store_id: number,
    query: QueryProductDto,
  ): Promise<ProductsPaginatedDto> {
    const {
      page = 1,
      limit = 10,
      search,
      sortKey,
      sortOrder = 'desc',
      category_ids,
      price_min,
      price_max,
      color_id,
      stars,
    } = query;
    await new Promise((resolve) => setTimeout(resolve, 900));

    const qb = this.buildProductQuery(
      store_id,
      search,
      sortKey,
      sortOrder,
      category_ids,
      price_min,
      price_max,
      color_id,
      stars,
    );

    const total = await qb.getCount();
    const { entities, raw } = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const products: ProductBasicDto[] = entities.map((product, index) => ({
      ...product,
      avg_rating: parseFloat(raw[index]?.avg_rating) || 0,
      reviews_count: parseInt(raw[index]?.reviews_count, 10) || 0,
    }));

    return this.buildPaginatedResponse(products, total, page, limit, query);
  }

  async findOne(id: number, store_id: number) {
    const product = await this.productRepository.findOne({
      where: { id, store_id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found.`);
    }

    return product;
  }

  async checkDuplicateTitleInStore(store_id: number, title: string) {
    const count = await this.productRepository.count({
      where: { store_id, title },
    });

    if (count > 0) {
      throw new ConflictException(
        `Product with title '${title}' already exists in this store.`,
      );
    }
  }

  // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ЗАПРОСОВ ====================

  private buildProductQuery(
    store_id: number,
    search?: string,
    sortKey?: string,
    sortOrder: string = 'desc',
    category_ids?: number[],
    price_min?: number,
    price_max?: number,
    color_id?: number,
    stars?: number,
  ) {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.color', 'color')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COALESCE(ROUND(AVG(review.rating)::numeric, 1), 0)')
            .from(Review, 'review')
            .where('review.product_id = product.id'),
        'avg_rating',
      )
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(review.id)')
            .from(Review, 'review')
            .where('review.product_id = product.id'),
        'reviews_count',
      )
      .where('product.store_id = :store_id', { store_id }); // ✅ всегда

    if (search?.trim()) {
      qb.andWhere('product.title ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    if (category_ids && category_ids.length > 0) {
      qb.andWhere('product.category_id IN (:...category_ids)', {
        category_ids,
      });
    }

    if (
      price_min !== undefined &&
      price_max !== undefined &&
      price_min > price_max
    ) {
      throw new BadRequestException(
        'Minimum price cannot be greater than maximum price.',
      );
    }

    if (price_min !== undefined && price_min < 0) {
      throw new BadRequestException('Minimum price cannot be negative.');
    }

    if (price_min !== undefined) {
      qb.andWhere('product.price >= :price_min', { price_min });
    }

    if (price_max !== undefined) {
      qb.andWhere('product.price <= :price_max', { price_max });
    }

    if (color_id !== undefined) {
      qb.andWhere('product.color_id = :color_id', { color_id });
    }

    if (stars !== undefined) {
      qb.andWhere(
        `(SELECT COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) FROM reviews r WHERE r.product_id = product.id) >= :starsMin AND (SELECT COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) FROM reviews r WHERE r.product_id = product.id) < :starsMax`,
        { starsMin: stars, starsMax: stars + 1 },
      );
    }

    const sortMapping: Record<string, string> = {
      title: 'product.title',
      price: 'product.price',
      color: 'color.name',
      category: 'category.title',
    };

    if (sortKey && sortMapping[sortKey]) {
      qb.orderBy(
        sortMapping[sortKey],
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    qb.addOrderBy('product.updatedAt', 'DESC');

    return qb;
  }

  private buildPaginatedResponse(
    data: ProductBasicDto[],
    total: number,
    page: number,
    limit: number,
    query: QueryProductDto,
  ): ProductsPaginatedDto {
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      query,
    };
  }
}
