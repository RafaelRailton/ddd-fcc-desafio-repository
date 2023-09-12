import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ProductModel from "./product.model";
import { OrderModel } from "./order.model";


@Table({ 
  name: { plural: "order_items" }, 
  timestamps: false
})
export class OrderItemModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false, field: "product_id" })
  declare productId: string;

  @BelongsTo(() => ProductModel)
  declare product: ProductModel

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false, field: "order_id" })
  declare orderId: string;

  @BelongsTo(() => OrderModel)
  declare order: OrderModel

  @Column({ allowNull: false, type: "varchar" })
  declare name: string;

  @Column({ allowNull: false, type: "integer" })
  declare price: number;

  @Column({ allowNull: false, type: "integer" })
  declare quantity: number;
}