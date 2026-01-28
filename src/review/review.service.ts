import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { CreateReviewDto, ReviewBasicDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private productService: ProductService,
  ) {}
  async create(
    createReviewDto: CreateReviewDto,
    store_id: number,
    user_id: number,
  ): Promise<ReviewBasicDto> {
    await this.productService.findOne(createReviewDto.product_id, store_id);
    const review = this.reviewRepository.create({
      ...createReviewDto,
      store_id,
      user_id,
    });
    return this.reviewRepository.save(review);
  }

  findAll(store_id: number): Promise<ReviewBasicDto[]> {
    return this.reviewRepository.find({
      where: { store_id },
      order: { updatedAt: 'DESC' },
      relations: ['product'],
    });
  }

  async findOne(id: number, store_id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id, store_id },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(
    id: number,
    store_id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewBasicDto> {
    const review = await this.findOne(id, store_id);
    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: number, store_id: number): Promise<ReviewBasicDto> {
    const review = await this.findOne(id, store_id);
    return this.reviewRepository.remove(review);
  }
}
