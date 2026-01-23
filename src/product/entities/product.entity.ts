import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { Category } from '../../category/entities/category.entity';
import { Color } from '../../color/entities/color.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  images: string;

  @ManyToOne(() => Store, (store) => store.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  store_id: number;

  @ManyToOne(() => Category, (category) => category.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: number;

  @ManyToOne(() => Color, (color) => color.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @Column()
  color_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
