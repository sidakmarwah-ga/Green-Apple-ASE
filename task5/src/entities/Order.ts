import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Check } from 'typeorm';
import { Customer } from './Customer';
import { Product } from './Product';
import { Variant } from './Variant';

export enum OrderStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  COMPLETE = "Complete",
  FAILED = "Failed",
}

@Entity()
@Check(`"numberOfUnitsOrdered" > 0`)
@Check(`"totalAmount" > 0`)
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({unsigned: true})
  numberOfUnitsOrdered: number;

  @Column({unsigned: true})
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Customer, customer => customer.orders)
  customer: Customer;

  @ManyToOne(() => Product, product => product.orders)
  product: Product;
  
  @ManyToOne(() => Variant, variant => variant.orders)
  variant: Variant;
}
