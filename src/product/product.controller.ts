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
} from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@AuthJwt()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('store/:storeId')
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
    @Param('storeId') storeId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(
      +storeId,
      createProductDto,
      files,
      user_id,
    );
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @UseInterceptors(FilesInterceptor('images', 10)) // максимум 10 файлов
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: ProductBasicDto })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.update(+id, updateProductDto, files);
  }

  @Get()
  @ApiOkResponse({ type: ProductFullDto })
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get('store/:storeId')
  @ApiOkResponse({ type: ProductFullDto })
  @ApiBody({ type: QueryProductDto })
  findAllByStoreID(
    @Param('storeId') storeId: string,
    @Query() query: QueryProductDto,
  ) {
    return this.productService.findAllByStoreID(storeId, query);
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiOkResponse({ type: ProductBasicDto })
  findById(@Param('id') id: string) {
    return this.productService.findById(+id);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
