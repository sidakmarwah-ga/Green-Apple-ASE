import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Product } from './ProductEntity';
import { Variant } from './VariantEntity';

@Entity()
export class Shop {
  @PrimaryColumn()
  name!: string;

  @Column()
  lastSync!: Date;

  @OneToMany(() => Product, product => product.shop)
  products!: Product[];

  @OneToMany(() => Variant, variant => variant.shop)
  variants!: Variant[];
}
