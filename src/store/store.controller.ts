import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { transformStoreToDto } from 'src/utils/transform-store';
import { CreateStoreDto, StoreResponseDto } from './dto/store.dto';
import { StoreService } from './store.service';

@AuthJwt()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() input: CreateStoreDto) {
    return this.storeService.create(input, +user.id);
  }

  @Get()
  async findAll(@CurrentUser('id') id: number): Promise<StoreResponseDto[]> {
    const stores = await this.storeService.findAll(id);
    return stores.map((store) => {
      return transformStoreToDto(store);
    });
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.storeService.findOne(+id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
