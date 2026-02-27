import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Order } from './Order';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
}
