import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderItemModel } from "./order-item.model";
import CustomerModel from "./customer.model";

@Table({ 
  name: { plural: "orders" }, 
  timestamps: false
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @ForeignKey(() => CustomerModel)
  @Column({ allowNull: false, field: "customer_id" })
  declare customerId: string;

  @BelongsTo(() => CustomerModel)
  declare customer: CustomerModel

  @HasMany(() => OrderItemModel)
  declare items: OrderItemModel[]

  @PrimaryKey
  @Column({ allowNull: false, type: "integer" })
  declare total: number;
}