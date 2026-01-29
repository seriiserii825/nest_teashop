import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileManagerService } from 'src/file-manager/file-manager.service';
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
    private readonly fileManagerService: FileManagerService,
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
    files?: Express.Multer.File[],
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

    // 👇 Обрабатываем изображения через FileManagerService
    const { filesToKeep, filesToDelete } =
      this.fileManagerService.processFileUpdates(
        [store.picture],
        updateStoreDto.old_images ? updateStoreDto.old_images : [],
      );

    // // 👇 Объединяем старые и новые изображения
    const pictures = await this.fileManagerService.mergeFiles(
      filesToKeep,
      files,
      `stores/${store.id}`,
    );
    if (pictures.length > 0) {
      store.picture = pictures[0];
    }

    // Save and return the updated store
    const updatedStore = await this.storeRepository.save(store);

    if (filesToDelete.length > 0) {
      await this.fileManagerService.deleteMultipleFiles(filesToDelete);
    }
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
