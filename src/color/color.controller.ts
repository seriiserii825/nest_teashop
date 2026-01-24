import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ColorService } from './color.service';
import {
  ColorResponseDto,
  CreateColorDto,
  UpdateColorDto,
} from './dto/create-color.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post(':store_id')
  @ApiParam({ name: 'store_id', type: Number })
  @ApiBody({ type: CreateColorDto })
  @ApiCreatedResponse({ type: ColorResponseDto })
  create(
    @CurrentUser('id') user_id: number,
    @Body() createColorDto: CreateColorDto,
    @Param('store_id') store_id: number,
  ) {
    return this.colorService.create(createColorDto, store_id, user_id);
  }

  @Get(':store_id')
  @ApiParam({ name: 'store_id', type: Number, description: 'Store ID' })
  @ApiOkResponse({ type: [ColorResponseDto] })
  findAll(@Param('store_id') store_id: string) {
    return this.colorService.findAll(+store_id);
  }

  @Get(':id/:store_id')
  @ApiParam({ name: 'id', type: Number, description: 'Color ID' })
  @ApiParam({ name: 'store_id', type: Number, description: 'Store ID' })
  @ApiOkResponse({ type: ColorResponseDto })
  findOne(@Param('id') id: string, @Param('store_id') store_id: string) {
    return this.colorService.findOne(+id, +store_id);
  }

  @Patch(':id/:store_id')
  @ApiParam({ name: 'id', type: Number, description: 'Color ID' })
  @ApiParam({ name: 'store_id', type: Number, description: 'Store ID' })
  @ApiOkResponse({ type: ColorResponseDto })
  update(
    @CurrentUser('id') user_id: number,
    @Param('id') id: string,
    @Param('store_id') store_id: string,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.colorService.update(+id, +store_id, updateColorDto, user_id);
  }

  @Delete(':id/:store_id')
  @ApiParam({ name: 'id', type: Number, description: 'Color ID' })
  @ApiParam({ name: 'store_id', type: Number, description: 'Store ID' })
  @ApiOkResponse({ type: ColorResponseDto })
  remove(@Param('id') id: string, @Param('store_id') store_id: string) {
    return this.colorService.remove(+id, +store_id);
  }
}
