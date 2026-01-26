import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreService } from 'src/store/store.service';
import { Not, Repository } from 'typeorm';
import {
  ColorBasicDto,
  CreateColorDto,
  UpdateColorDto,
} from './dto/create-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color) private colorRepository: Repository<Color>,
    private storeService: StoreService,
  ) {}

  async create(
    createColorDto: CreateColorDto,
    store_id: number,
    user_id: number,
  ): Promise<ColorBasicDto> {
    await this.storeService.findOne(store_id, user_id);
    await this.hasTheSameNameInStore(createColorDto.name, store_id);
    const color = this.colorRepository.create({
      ...createColorDto,
      store_id,
    });
    return this.colorRepository.save(color);
  }

  findAll(store_id: number): Promise<ColorBasicDto[]> {
    return this.colorRepository.find({
      where: { store_id },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number, store_id: number): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: { id, store_id },
    });
    if (!color) {
      throw new NotFoundException('Color not found in your store');
    }
    return color;
  }

  async update(
    id: number,
    store_id: number,
    updateColorDto: UpdateColorDto,
    user_id: number,
  ): Promise<ColorBasicDto> {
    await this.storeService.findOne(store_id, user_id);
    if (updateColorDto.name) {
      await this.hasTheSameNameInStoreWithoutCurrent(
        updateColorDto.name,
        store_id,
        id,
      );
    }
    const color = await this.findOne(id, store_id);
    Object.assign(color, updateColorDto);
    return this.colorRepository.save(color);
  }

  async remove(id: number, store_id: number): Promise<ColorBasicDto> {
    const color = await this.findOne(id, store_id);
    return this.colorRepository.remove(color);
  }

  async hasTheSameNameInStore(name: string, store_id: number): Promise<void> {
    const color = await this.colorRepository.findOne({
      where: { name, store_id },
    });
    if (color) {
      throw new ConflictException('Color name already exists in your store');
    }
  }

  async hasTheSameNameInStoreWithoutCurrent(
    name: string,
    store_id: number,
    color_id: number,
  ): Promise<void> {
    const color = await this.colorRepository.findOne({
      where: { name, store_id, id: Not(color_id) },
    });
    if (color) {
      throw new ConflictException('Color name already exists in your store');
    }
  }
}
