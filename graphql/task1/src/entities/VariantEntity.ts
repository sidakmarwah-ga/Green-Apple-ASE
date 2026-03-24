import { Entity, Column, ManyToOne, Check } from 'typeorm';
import { Product } from './ProductEntity';
import { AppBaseEntity } from './BaseEntity';
import { Shop } from './ShopEntity';

@Entity()
export class Variant extends AppBaseEntity {
  @Column()
  title!: string;

  @Column()
  displayName!: string;

  @Column({nullable: true})
  sku!: string;

  @Column('double precision')
  price!: number;

  @Column({unsigned: true})
  stock!: number;

  @ManyToOne(() => Product, product => product.variants,
  {onDelete: "CASCADE"})
  product!: Product;

  @ManyToOne(() => Shop, shop => shop.variants,
  {onDelete: "CASCADE"})
  shop!: Shop;
}
