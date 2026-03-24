import { PrimaryColumn, Column } from 'typeorm';

export class AppBaseEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
