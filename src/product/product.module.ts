import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FileService } from 'src/file/file.service';
import { FileManagerModule } from 'src/file-manager/file-manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FileManagerModule],
  controllers: [ProductController],
  providers: [ProductService, FileService],
  exports: [ProductService],
})
export class ProductModule {}
