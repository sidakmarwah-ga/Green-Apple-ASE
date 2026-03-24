import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Product } from './ProductEntity';

@Entity()
export class Shop {
  @PrimaryColumn()
  name!: string;

  @Column()
  lastSync!: Date;

  @OneToMany(() => Product, product => product.shop)
  products!: Product[];
}
