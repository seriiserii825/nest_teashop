import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import {
  CreateProductDto,
  ProductBasicDto,
  ProductFullDto,
  ProductsPaginatedDto,
} from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { Admin } from 'src/auth/decorators/admin.decorator';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Admin()
  @AuthJwt()
  @Post('store/:store_id')
  @ApiBody({ type: CreateProductDto })
  @ApiConflictResponse({
    description: 'Product with this title already exists in the store',
  })
  @ApiOkResponse({ type: ProductBasicDto })
  @UseInterceptors(FilesInterceptor('images', 10)) // максимум 10 файлов
  @ApiConsumes('multipart/form-data')
  create(
    @CurrentUser('id') user_id: number,
    @Body() createProductDto: CreateProductDto,
    @Param('store_id') store_id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(
      +store_id,
      createProductDto,
      files,
      user_id,
    );
  }

  @Admin()
  @AuthJwt()
  @Patch(':id/store/:store_id')
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'store_id', description: 'Store ID' })
  @ApiBody({ type: UpdateProductDto })
  @UseInterceptors(FilesInterceptor('images', 10)) // максимум 10 файлов
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: ProductBasicDto })
  update(
    @Param('id') id: string,
    @Param('store_id') store_id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.update(+id, +store_id, updateProductDto, files);
  }

  @Get('store/:store_id')
  @ApiParam({ name: 'store_id', description: 'Store ID' })
  @ApiOkResponse({ type: ProductsPaginatedDto })
  findAll(
    @Param('store_id') store_id: string,
    @Query() query: QueryProductDto,
  ): Promise<ProductsPaginatedDto> {
    return this.productService.findAll(+store_id, query);
  }

  @Get('store/:store_id/find-array')
  @ApiOkResponse({ type: [ProductBasicDto] })
  findAllArray(@Param('store_id') store_id: string) {
    return this.productService.findAllArray(+store_id);
  }

  @Get(':id/store/:store_id')
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'store_id', description: 'Store ID' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiOkResponse({ type: ProductBasicDto })
  findOne(@Param('id') id: string, @Param('store_id') store_id: string) {
    return this.productService.findOne(+id, +store_id);
  }

  @Admin()
  @AuthJwt()
  @Delete(':id/store/:store_id')
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'store_id', description: 'Store ID' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(@Param('id') id: string, @Param('store_id') store_id: string) {
    return this.productService.remove(+id, +store_id);
  }
}
