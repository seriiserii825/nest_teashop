import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { transformStoreToDto } from 'src/utils/transform-store';
import {
  CreateStoreDto,
  StoreRemoveResponseDto,
  StoreResponseDto,
  UpdateStoreDto,
} from './dto/store.dto';
import { StoreService } from './store.service';

@AuthJwt()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiBody({ type: CreateStoreDto })
  @ApiCreatedResponse({ type: StoreResponseDto })
  create(@CurrentUser() user: User, @Body() input: CreateStoreDto) {
    return this.storeService.create(input, +user.id);
  }

  @Get()
  @ApiOkResponse({ type: [StoreResponseDto] })
  async findAll(@CurrentUser('id') id: number): Promise<StoreResponseDto[]> {
    const stores = await this.storeService.findAll(id);
    return stores.map((store) => {
      return transformStoreToDto(store);
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: StoreResponseDto })
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.storeService.findOne(+id, user.id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateStoreDto })
  @ApiOkResponse({ type: StoreResponseDto })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    return this.storeService.update(+id, updateStoreDto, user.id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: StoreRemoveResponseDto })
  remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<StoreRemoveResponseDto> {
    return this.storeService.remove(+id, user.id);
  }
}
