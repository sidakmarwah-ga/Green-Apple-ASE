import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Variant } from './VariantEntity';
import { AppBaseEntity } from './BaseEntity';
import { Shop } from './ShopEntity';

@Entity()
export class Product extends AppBaseEntity {
  @Column()
  title!: string;

  @Column("text", { array: true })
  tags!: string[];

  @Column()
  productType!: string;

  @Column('jsonb')
  category!: any;
  
  @Column()
  status!: string;

  @Column()
  vendor!: string;
  
  @Column()
  publishedAt!: Date;

  @OneToMany(() => Variant, variant => variant.product)
  variants!: Variant[];

  @ManyToOne(() => Shop, shop => shop.products,
  {onDelete: "CASCADE"})
  shop!: Shop;
}
