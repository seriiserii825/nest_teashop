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
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { CreateReviewDto, ReviewBasicDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';
import { Admin } from 'src/auth/decorators/admin.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Admin()
  @AuthJwt()
  @Post('store/:store_id/product/:product_id')
  @ApiBody({ type: CreateReviewDto })
  @ApiParam({ name: 'store_id', type: Number })
  @ApiParam({ name: 'product_id', type: Number })
  @ApiCreatedResponse({ type: ReviewBasicDto })
  create(
    @CurrentUser('id') user_id: number,
    @Param('store_id') store_id: number,
    @Param('product_id') product_id: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewBasicDto> {
    return this.reviewService.create(
      createReviewDto,
      +store_id,
      +user_id,
      +product_id,
    );
  }

  @Get('store/:store_id')
  @ApiParam({ name: 'store_id', type: Number })
  @ApiOkResponse({ type: [ReviewBasicDto] })
  findAll(@Param('store_id') store_id: string) {
    return this.reviewService.findAll(+store_id);
  }

  @Get(':id/store/:store_id')
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'store_id', type: Number })
  @ApiOkResponse({ type: ReviewBasicDto })
  findOne(@Param('id') id: string, @Param('store_id') store_id: string) {
    return this.reviewService.findOne(+id, +store_id);
  }

  @Admin()
  @AuthJwt()
  @Patch(':id/store/:store_id')
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'store_id', type: Number })
  @ApiBody({ type: UpdateReviewDto })
  @ApiOkResponse({ type: ReviewBasicDto })
  update(
    @Param('id') id: string,
    @Param('store_id') store_id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewBasicDto> {
    return this.reviewService.update(+id, +store_id, updateReviewDto);
  }

  @Admin()
  @AuthJwt()
  @Delete(':id/store/:store_id')
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'store_id', type: Number })
  @ApiOkResponse({ type: ReviewBasicDto })
  remove(@Param('id') id: string, @Param('store_id') store_id: string) {
    return this.reviewService.remove(+id, +store_id);
  }
}
