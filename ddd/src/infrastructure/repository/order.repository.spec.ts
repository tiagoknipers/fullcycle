import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([
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
  
    it("should create a new order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);
  
      const ordemItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );
  
      const order = new Order("123", "123", [ordemItem]);
  
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);
  
      const orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });
  
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: ordemItem.id,
            name: ordemItem.name,
            price: ordemItem.price,
            quantity: ordemItem.quantity,
            order_id: "123",
            product_id: "123",
          },
        ],
      });
    });

    it("should update an order", async () => {
      const customerRepository = new CustomerRepository();
      const customer1 = new Customer("123", "Customer 1");
      const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer1.changeAddress(address1);
      await customerRepository.create(customer1);
  
      const productRepository = new ProductRepository();
      const product1 = new Product("123", "Product 1", 10);
      await productRepository.create(product1);
  
      const ordemItem1 = new OrderItem(
        "1",
        product1.name,
        product1.price,
        product1.id,
        2
      );

      const orderId = "123";
  
      const order = new Order(orderId, customer1.id, [ordemItem1]);  
      const orderRepository = new OrderRepository();      
      await orderRepository.create(order);

      const orderModel1 = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      })

      expect(orderModel1.toJSON()).toStrictEqual({
        id: orderId,
        customer_id: customer1.id,
        total: order.total(),
        items: [
          {
            id: ordemItem1.id,
            name: ordemItem1.name,
            price: ordemItem1.price,
            quantity: ordemItem1.quantity,
            order_id: orderId,
            product_id: product1.id,
          },
        ],
      });

      const product2 = new Product("456", "Product 2", 20);
      await productRepository.create(product2);

      const ordemItem2 = new OrderItem(
        "2",
        product2.name,
        product2.price,
        product2.id,
        3
      );
      order.addItem(ordemItem2);      
  
      await orderRepository.update(order);
      
      const orderModel2 = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      })
      
      expect(orderModel2.toJSON()).toStrictEqual({
        id: orderId,
        customer_id: customer1.id,
        total: order.total(),
        items: [
          {
            id: ordemItem1.id,
            name: ordemItem1.name,
            price: ordemItem1.price,
            quantity: ordemItem1.quantity,
            order_id: orderId,
            product_id: product1.id,
          },
          {
            id: ordemItem2.id,
            name: ordemItem2.name,
            price: ordemItem2.price,
            quantity: ordemItem2.quantity,
            order_id: orderId,
            product_id: product2.id,
          },
        ],
      });    
    });

    it("should find a order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);
  
      const ordemItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );

      const orderId = "123";  
      const order = new Order(orderId, customer.id, [ordemItem]);  
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);
  
      const orderResult = await orderRepository.find(order.id);  
      expect(order).toStrictEqual(orderResult);
    });
  
    it('should find all products', async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product1 = new Product("123", "Product 1", 10);
      await productRepository.create(product1);
  
      const product2 = new Product("456", "Product 2", 20);
      await productRepository.create(product2);
  
      const orderItem1 = new OrderItem(
        "1",
        product1.name,     
        product1.price,
        product1.id, 
        2
      );
  
      const orderItem2 = new OrderItem(
        "2",           
        product2.name,
        product2.price,
        product2.id,
        5
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