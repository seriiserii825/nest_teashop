import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Delete, Param } from '@nestjs/common';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { transformStoreToDto } from 'src/utils/transform-store';
import type { CreateStoreDto, StoreResponseDto } from './dto/store.dto';
import { StoreService } from './store.service';

@AuthJwt()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @TypedRoute.Post()
  create(@CurrentUser() user: User, @TypedBody() input: CreateStoreDto) {
    return this.storeService.create(input, +user.id);
  }

  @TypedRoute.Get()
  async findAll(@CurrentUser('id') id: number): Promise<StoreResponseDto[]> {
    const stores = await this.storeService.findAll(id);
    return stores.map((store) => {
      return transformStoreToDto(store);
    });
  }

  @TypedRoute.Get(':id')
  findOne(@CurrentUser() user: User, @TypedParam('id') id: string) {
    return this.storeService.findOne(+id, user.id);
  }

  // @Patch(':id')
  // @TypedRoute.Put(':id')
  // update(
  //   @CurrentUser() user: User,
  //   @TypedParam('id') id: number,
  //   @TypedBody() updateStoreDto: UpdateStoreDto,
  // ) {
  //   return this.storeService.update(id, updateStoreDto, user.id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
