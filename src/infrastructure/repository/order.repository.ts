import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import { OrderRepositoryInterface } from "../../domain/repository/order-repository.interface";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { OrderModel } from "../db/sequelize/model/order.model";



export class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customerId: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      { include: [{ model: OrderItemModel }] }
    );
  }

  async update(entity: Order): Promise<void> {
    try {
      const sequelize = OrderModel.sequelize;
      await sequelize.transaction(async (t) => {
        await OrderItemModel.destroy({
          where: { order_id: entity.id },
          transaction: t,
        });
        const items = entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        }));
        await OrderItemModel.bulkCreate(items, { transaction: t });
        await OrderModel.update(
          { total: entity.total() },
          { where: { id: entity.id }, transaction: t }
        );
      });
    } catch (error) {
      console.log(`error: ${error}`);
    }
 
  }

  async find(id: string): Promise<Order> {
    const model = await OrderModel.findOne({
      where: { id: id },
      include: [{ model: OrderItemModel }],
    });

    const items: Array<OrderItem> = [];

    for (const iterator of model.items) {
      items.push(
        new OrderItem(
          iterator.id,
          iterator.name,
          iterator.price,
          iterator.productId,
          iterator.quantity
        )
      );
    }
    const order = new Order(model.id, model.customerId, items);
    return order;
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({ include: [{ model: OrderItemModel }] })    
    return orders.map(order => {
      const orderItems: Array<OrderItem> = []

      for (const iterator of order.items) {
        orderItems.push(new OrderItem(iterator.id, iterator.name, iterator.price, iterator.productId,  iterator.quantity))
      }

      return new Order(order.id, order.customerId, orderItems)
    });
  }
}