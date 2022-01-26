import { Product, ProductStore } from "../../models/product";
import Client from "../../database";

const store = new ProductStore();
let donut: Product;
const resetData = async () => {
  const conn = await Client.connect();
  let sql = "DELETE FROM products;";
  await conn.query(sql);
  //Reset the sequences
  sql = "ALTER SEQUENCE products_id_seq RESTART WITH 1;";
  await conn.query(sql);
  conn.release();
};

describe("Product Model", () => {
  beforeAll(async () => {
    await resetData();
  });
  afterAll(async () => {
    await resetData();
  });

  it("create product should create a new product", async () => {
    //Assign result to user to determine user id
    expect(
      await store.create({
        id: 1,
        name: "Donut",
        price: 20,
        category: "Food",
      })
    ).toEqual({
      id: 1,
      name: "Donut",
      price: 20,
      category: "Food",
    });
    //insert new products

    expect(
      await store.create({
        id: 2,
        name: "Coke",
        price: 18,
        category: "Drink",
      })
    ).toEqual({
      id: 2,
      name: "Coke",
      price: 18,
      category: "Drink",
    });
  });

  it("index should get a list of products", async () => {
    //
    const result = await store.index();
    expect(result).toEqual([
      { id: 1, name: "Donut", price: 20, category: "Food" },
      { id: 2, name: "Coke", price: 18, category: "Drink" },
    ]);
  });
});
