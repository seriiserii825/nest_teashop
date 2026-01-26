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
import {
  CreateStoreDto,
  StoreBasicDto,
  StoreRemoveDto,
  UpdateStoreDto,
} from './dto/store.dto';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';

@AuthJwt()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiBody({ type: CreateStoreDto })
  @ApiCreatedResponse({ type: StoreBasicDto })
  create(
    @CurrentUser() user: User,
    @Body() input: CreateStoreDto,
  ): Promise<StoreBasicDto> {
    return this.storeService.create(input, +user.id);
  }

  @Get()
  @ApiOkResponse({ type: [StoreBasicDto] })
  async findAll(@CurrentUser('id') id: number): Promise<StoreBasicDto[]> {
    const stores = await this.storeService.findAll(id);
    return stores;
  }

  @Get(':id')
  @ApiOkResponse({ type: StoreBasicDto })
  findOne(@CurrentUser() user: User, @Param('id') id: string): Promise<Store> {
    return this.storeService.findOne(+id, user.id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateStoreDto })
  @ApiOkResponse({ type: StoreBasicDto })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreBasicDto> {
    return this.storeService.update(+id, updateStoreDto, user.id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: StoreRemoveDto })
  remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<StoreRemoveDto> {
    return this.storeService.remove(+id, user.id);
  }
}
