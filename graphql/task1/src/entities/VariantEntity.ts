import { Entity, Column, ManyToOne, Check } from 'typeorm';
import { Product } from './ProductEntity';
import { AppBaseEntity } from './BaseEntity';

@Entity()
export class Variant extends AppBaseEntity {
  @Column()
  title!: string;

  @Column()
  displayName!: string;

  @Column({unique: true, nullable: true})
  sku!: string;

  @Column('double precision')
  price!: number;

  @Column({unsigned: true})
  stock!: number;

  @ManyToOne(() => Product, product => product.variants,
  {onDelete: "CASCADE"})
  product!: Product;
}
