import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import { OrderRepository } from "./order.repository";
import { OrderModel } from "../db/sequelize/model/order.model";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";


describe("Customer Repository unit tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new Order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Rafael");
    const address = new Address(
      "Street Test",
      13,
      "57525000",
      "City Test",
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Name Test", 14);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1", product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: [{ model: OrderItemModel }],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customerId: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          orderId: order.id,
          productId: orderItem.productId,
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Rafael");
    const address = new Address(
      "Street Test",
      13,
      "57525000",
      "City Test",
    );
    customer.Address = address;
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 14);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1", product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("1", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    
   
    
    const orderItemUpdate = new OrderItem(
      "1", product.name,
      14,
      product.id,
      2
    );
    const orderUpdate = new Order('1', customer.id, [orderItemUpdate]);
    await orderRepository.update(orderUpdate);

    const orderModel = await OrderModel.findOne({
      where: { id: orderUpdate.id },
      include: [{ model: OrderItemModel }],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customerId: customer.id,
      total: orderUpdate.total(),
      items: [
        {
          id: orderItemUpdate.id,
          name: orderItemUpdate.name,
          price: orderItemUpdate.price,
          quantity: orderItemUpdate.quantity,
          orderId: '1',
          productId: '123',
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Rafael");
    const address = new Address(
      "Street Test",
      13,
      "57525000",
      "City Test",
    );
    customer.Address = address;
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Name Test", 14);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1", product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const result = await orderRepository.find(order.id);
    expect(result.id).toBe(order.id);
    expect(result.customerId).toBe(order.customerId);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Rafael");
    const address = new Address(
      "Street Test",
      13,
      "57525000",
      "City Test",
    );
    customer.Address = address;
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("123", "Name Test 1", 10);
    await productRepository.create(product1);

    const product2 = new Product("321", "Name Test 2", 20);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      "1", product1.name,
      product1.price,
      product1.id,
      2
    );

    const orderItem2 = new OrderItem(
      "2", product2.name,
      product2.price,
      product2.id,
      2
    );

    const orderRepository = new OrderRepository();
    const order = new Order("1", customer.id, [orderItem1]);
    await orderRepository.create(order);

    const order2 = new Order("2", customer.id, [orderItem2]);
    await orderRepository.create(order2);

    const result = await orderRepository.findAll();

    expect(result.length).toEqual(2);
  });
});