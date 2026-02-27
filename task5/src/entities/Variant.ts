import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, Check } from 'typeorm';
import { Product } from './Product';
import { Order } from './Order';

@Entity()
@Check(`"price" > 0`)
@Check(`"stock" >= 0`)
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({unique: true})
  sku: string;

  @Column({unsigned: true})
  price: number;

  @Column({unsigned: true})
  stock: number;

  @Column('jsonb')
  attributes: any;

  @ManyToOne(() => Product, product => product.variants)
  product: Product;

  @OneToMany(() => Order, order => order.variant)
  orders: Order[];
}
