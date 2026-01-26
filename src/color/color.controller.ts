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
  ColorBasicDto,
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

  @Post('store/:store_id')
  @ApiParam({ name: 'store_id', type: Number })
  @ApiBody({ type: CreateColorDto })
  @ApiCreatedResponse({ type: ColorBasicDto })
  create(
    @CurrentUser('id') user_id: number,
    @Body() createColorDto: CreateColorDto,
    @Param('store_id') store_id: number,
  ): Promise<ColorBasicDto> {
    return this.colorService.create(createColorDto, store_id, user_id);
  }

  @Get('store/:store_id')
  @ApiParam({ name: 'store_id', type: Number, description: 'Store ID' })
  @ApiOkResponse({ type: [ColorBasicDto] })
  findAll(@Param('store_id') store_id: string): Promise<ColorBasicDto[]> {
    return this.colorService.findAll(+store_id);
  }

  @Get(':id/store/:store_id')
  @ApiParam({ name: 'id', type: Number, description: 'Color ID' })
  @ApiParam({ name: 'store_id', type: Number, description: 'Store ID' })
  @ApiOkResponse({ type: ColorBasicDto })
  findOne(
    @Param('id') id: string,
    @Param('store_id') store_id: string,
  ): Promise<ColorBasicDto> {
    return this.colorService.findOne(+id, +store_id);
  }

  @Patch(':id/store/:store_id')
  @ApiParam({ name: 'id', type: Number, description: 'Color ID' })
  @ApiParam({ name: 'store_id', type: Number, description: 'Store ID' })
  @ApiOkResponse({ type: ColorBasicDto })
  update(
    @CurrentUser('id') user_id: number,
    @Param('id') id: string,
    @Param('store_id') store_id: string,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<ColorBasicDto> {
    return this.colorService.update(+id, +store_id, updateColorDto, user_id);
  }

  @Delete(':id/store/:store_id')
  @ApiParam({ name: 'id', type: Number, description: 'Color ID' })
  @ApiParam({ name: 'store_id', type: Number, description: 'Store ID' })
  @ApiOkResponse({ type: ColorBasicDto })
  remove(
    @Param('id') id: string,
    @Param('store_id') store_id: string,
  ): Promise<ColorBasicDto> {
    return this.colorService.remove(+id, +store_id);
  }
}
