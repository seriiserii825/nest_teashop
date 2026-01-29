import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from 'src/store/store.module';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { Color } from './entities/color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Color]), StoreModule],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
