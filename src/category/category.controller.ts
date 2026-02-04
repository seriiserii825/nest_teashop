import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { CategoryService } from './category.service';
import { CategoryBasicDto, CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Admin } from 'src/auth/decorators/admin.decorator';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @AuthJwt()
  @Admin()
  @Post('store/:store_id')
  @ApiParam({ name: 'store_id', type: 'string' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ type: CategoryBasicDto })
  create(
    @CurrentUser('id') user_id: number,
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('store_id') store_id: string,
  ): Promise<CategoryBasicDto> {
    return this.categoryService.create(createCategoryDto, +store_id, user_id);
  }

  @Get('store/:store_id')
  @ApiParam({ name: 'store_id', type: 'string' })
  @ApiOkResponse({ type: [CategoryBasicDto] })
  findAll(@Param('store_id') store_id: string): Promise<CategoryBasicDto[]> {
    return this.categoryService.findAll(+store_id);
  }

  @Get('store/:store_id/with-products-count')
  @ApiParam({ name: 'store_id', type: 'string' })
  findAllWithProductsCount(@Param('store_id') store_id: string) {
    return this.categoryService.findAllWithProductsCount(+store_id);
  }

  @Get(':id/store/:store_id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'store_id', type: 'string' })
  @ApiOkResponse({ type: CategoryBasicDto })
  findOne(
    @Param('id') id: string,
    @Param('store_id') store_id: string,
  ): Promise<CategoryBasicDto> {
    return this.categoryService.findOne(+id, +store_id);
  }

  @AuthJwt()
  @Admin()
  @Patch(':id/store/:store_id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'store_id', type: 'string' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ type: CategoryBasicDto })
  update(
    @Param('id') id: string,
    @Param('store_id') store_id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryBasicDto> {
    return this.categoryService.update(+id, +store_id, updateCategoryDto);
  }

  @AuthJwt()
  @Admin()
  @Delete(':id/store/:store_id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'store_id', type: 'string' })
  @ApiOkResponse({ type: CategoryBasicDto })
  remove(
    @Param('id') id: string,
    @Param('store_id') store_id: string,
  ): Promise<CategoryBasicDto> {
    return this.categoryService.remove(+id, +store_id);
  }
}
