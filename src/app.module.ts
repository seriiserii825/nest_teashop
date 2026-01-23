import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ColorModule } from './color/color.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // Для production используйте миграции
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: false, // Автоматически запускать миграции
      }),
      inject: [ConfigService],
    }),
    UserModule,
    StoreModule,
    ProductModule,
    CategoryModule,
    ColorModule,
    ReviewModule,
    OrderModule,
    OrderItemModule,
    AuthModule,
  ],
})
export class AppModule {}
