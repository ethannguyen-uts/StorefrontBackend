import { Order, OrderStore } from "../../models/order";
import { User, UserStore } from "../../models/user";
import { Product, ProductStore } from "../../models/product";
import Client from "../../database";

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();
let currentOrder: Order;
let currentUser: User;
let pancake: Product;
let soju: Product;

const resetData = async () => {
  //Remove all created data
  const conn = await Client.connect();
  //Remove orders details
  let sql = "DELETE FROM orders_products;";
  await conn.query(sql);
  //Reset the sequences
  sql = "ALTER SEQUENCE orders_products_id_seq RESTART WITH 1;";
  await conn.query(sql);
  sql = "DELETE FROM orders;";
  await conn.query(sql);
  //Reset the sequences
  sql = "ALTER SEQUENCE orders_id_seq RESTART WITH 1;";
  await conn.query(sql);
  //Remove products
  sql = "DELETE FROM products;";
  await conn.query(sql);
  conn.release();
};

describe("Order model", () => {
  //Add a new user
  beforeAll(async () => {
    await resetData();
    //create a new user
    currentUser = await userStore.create({
      id: 10,
      first_name: "Jessica",
      last_name: "Tran",
      password: "123456",
    });
    //create new products
    pancake = await productStore.create({
      id: 20,
      name: "Pancake",
      price: 15,
      category: "Food",
    });
    soju = await productStore.create({
      id: 21,
      name: "Soju",
      price: 5,
      category: "Drink",
    });
  });

  afterAll(async () => {
    await resetData();
    //Remove current user
    await userStore.remove(currentUser.id);
  });

  it("create product should create a new order", async () => {
    const current_user_id = currentUser.id as unknown as number;
    const result = await store.create({
      id: 1,
      status: "active",
      user_id: current_user_id,
    });
    //Assign result to user to determine user id
    currentOrder = result;
    expect(result).toEqual({
      id: 1,
      status: "active",
      user_id: current_user_id,
    });
  });

  it("add product should add new products to an order", async () => {
    const current_order_id = currentOrder.id as unknown as number;

    expect(await store.addProduct(10, current_order_id, pancake.id!)).toEqual({
      id: 1,
      quantity: 10,
      order_id: current_order_id,
      product_id: pancake.id!,
    });
    expect(await store.addProduct(20, current_order_id, soju.id!)).toEqual({
      id: 2,
      quantity: 20,
      order_id: current_order_id,
      product_id: soju.id!,
    });
  });

  //After add products to order, should get an order with details products
  it("show should get order data", async () => {
    const orderData = await store.show(currentOrder.id!);
    expect(orderData).toEqual({
      id: currentOrder.id,
      status: currentOrder.status,
      user_id: currentUser.id!,
      details: [
        {
          id: 1,
          product_id: pancake.id!,
          product_name: pancake.name,
          quantity: 10,
          price: pancake.price,
        },
        {
          id: 2,
          product_id: soju.id!,
          product_name: soju.name,
          quantity: 20,
          price: soju.price,
        },
      ],
    });
  });

  it("index should get a list of orders", async () => {
    const current_user_id = currentUser.id as unknown as number;
    const result = await store.index();
    expect(result).toEqual([
      { id: 1, status: "active", user_id: current_user_id },
    ]);
  });
});
