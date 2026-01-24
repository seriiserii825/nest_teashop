import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { Color } from './entities/color.entity';
import { Store } from 'src/store/entities/store.entity';
import { StoreService } from 'src/store/store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Color, Store])],
  controllers: [ColorController],
  providers: [ColorService, StoreService],
})
export class ColorModule {}
