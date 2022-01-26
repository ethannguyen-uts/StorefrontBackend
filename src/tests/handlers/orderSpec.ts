import supertest from "supertest";
import { Product, ProductStore } from "../../models/product";
import { User, UserStore } from "../../models/user";
import app from "../../server";
import jwt from "jsonwebtoken";
import Client from "../../database";
import { compareSync } from "bcrypt";
import { Order } from "../../models/order";

const store = new ProductStore();
const userStore = new UserStore();
let token: string;
let orderUser: User;
let product1: Product;
let product2: Product;

const request = supertest(app);
describe("Testing orders endpoints", () => {
  beforeAll(async () => {
    orderUser = await userStore.create({
      id: 51,
      first_name: "order",
      last_name: "user",
      password: "123456",
    });
    const tokenSecret: string = process.env.TOKEN_SECRET as unknown as string;
    if (tokenSecret === undefined) {
      throw new Error("Token secret is not set");
    }
    token = jwt.sign({ user: orderUser }, tokenSecret);

    product1 = await store.create({
      id: 51,
      name: "order test product 1",
      price: 20,
      category: "Food",
    });
    product2 = await store.create({
      id: 52,
      name: "order test product 2",
      price: 20,
      category: "Food",
    });
  });

  afterAll(async () => {
    //delete all users;
    const conn = await Client.connect();
    let sql = "DELETE FROM orders_products;";
    await conn.query(sql);
    sql = "DELETE FROM orders;";
    await conn.query(sql);
    sql = "DELETE FROM products;";
    await conn.query(sql);
    sql = "DELETE FROM users;";
    await conn.query(sql);
    //Reset the sequences
    sql = "ALTER SEQUENCE users_id_seq RESTART WITH 1;";
    await conn.query(sql);
    conn.release();
  });

  it("create order endpoint, expect success", async () => {
    const newOrder: Order = {
      id: 21,
      status: "active",
      user_id: orderUser.id!,
    };
    const response = await request
      .post("/orders")
      .auth(token, { type: "bearer" })
      .send(newOrder);
    expect(response.status).toBe(200);
  });

  it("index order endpoint, expect success", async () => {
    const response = await request.get("/orders");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 21,
        status: "active",
        user_id: orderUser.id!,
      },
    ]);
  });

  it("add products into orders endpoint, expect success", async () => {
    const productAdd = { product_id: product1.id, quantity: 10 };
    const response = await request
      .post("/orders/21/products")
      .auth(token, { type: "bearer" })
      .send(productAdd);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      quantity: 10,
      order_id: 21,
      product_id: 51,
    });
  });

  it("show order endpoint, expect success", async () => {
    const response = await request
      .post("/orders/21")
      .auth(token, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 21,
      status: "active",
      user_id: orderUser.id!,
      details: [
        {
          id: 1,
          product_id: product1.id!,
          product_name: product1.name,
          quantity: 10,
          price: product1.price,
        },
      ],
    });
  });
});
