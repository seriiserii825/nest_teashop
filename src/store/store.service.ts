import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  CreateStoreDto,
  StoreBasicDto,
  StoreRemoveDto,
  UpdateStoreDto,
} from './dto/store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store) private storeRepository: Repository<Store>,
  ) {}
  async create(
    createStoreDto: CreateStoreDto,
    user_id: number,
  ): Promise<StoreBasicDto> {
    await this.checkStoreByTitle(createStoreDto.title, user_id);
    const newStore = this.storeRepository.create({
      title: createStoreDto.title,
      user_id,
    });
    await this.storeRepository.save(newStore);
    return newStore;
  }

  async findAll(user_id: number): Promise<StoreBasicDto[]> {
    const stores = await this.storeRepository.find({
      where: { user_id },
      order: { updatedAt: 'DESC' },
    });
    return stores;
  }

  async findOne(id: number, user_id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id, user_id },
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(
    id: number,
    updateStoreDto: UpdateStoreDto,
    user_id: number,
  ): Promise<StoreBasicDto> {
    // Check if there are fields to update
    if (Object.keys(updateStoreDto).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    // Only check title if it's being updated
    if (updateStoreDto.title) {
      await this.checkStoreByTitleForCurrentStore(
        updateStoreDto.title,
        user_id,
        id,
      );
    }

    const store = await this.findOne(id, user_id);

    // Merge the updates
    Object.assign(store, updateStoreDto);

    // Save and return the updated store
    const updatedStore = await this.storeRepository.save(store);
    return updatedStore;
  }

  async remove(id: number, user_id: number): Promise<StoreRemoveDto> {
    const store = await this.findOne(id, user_id);
    await this.storeRepository.remove(store);
    return { message: `Store with id ${id} removed successfully` };
  }

  async checkStoreByTitle(title: string, user_id: number): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { title, user_id },
    });
    if (store) {
      throw new NotFoundException(`Store with title ${title} already found`);
    }
  }

  async checkStoreByTitleForCurrentStore(
    title: string,
    user_id: number,
    store_id: number,
  ): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { title, user_id, id: Not(store_id) },
    });
    if (store) {
      throw new NotFoundException(`Store with title ${title} already found`);
    }
  }
}
