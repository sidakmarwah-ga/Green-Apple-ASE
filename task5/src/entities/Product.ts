import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Order } from './Order';
import { Variant } from './Variant';
import { Collection } from './Collection';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column('simple-array')
  tags!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Order, order => order.product)
  orders!: Order[];

  @OneToMany(() => Variant, variant => variant.product)
  variants!: Variant[];

  @ManyToMany(() => Collection, collection => collection.products)
  @JoinTable()
  collections!: Collection[];
}
