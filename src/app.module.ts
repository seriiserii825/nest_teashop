import { Module } from '@nestjs/common';
import { join } from 'path';
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
import { StatisticModule } from './statistic/statistic.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', 'uploads'), // for production build
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
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
    StatisticModule,
    FileManagerModule,
  ],
})
export class AppModule {}
