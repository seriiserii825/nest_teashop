import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { StoreService } from 'src/store/store.service';
import { Store } from 'src/store/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Store])],
  controllers: [CategoryController],
  providers: [CategoryService, StoreService],
})
export class CategoryModule {}
