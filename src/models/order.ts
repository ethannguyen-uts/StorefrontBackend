import { ClientBase } from "pg";
import Client from "../database";
import { Product } from "./product";

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};
export type DetailOrder = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

export type OrderData = {
  id?: number;
  status: string;
  user_id: number;
  details: DetailOrder[];
};

export class OrderStore {
  index = async (): Promise<Order[]> => {
    try {
      const conn = await Client.connect();
      const sql = "SELECT id, status, user_id FROM orders;";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw err;
    }
  };
  show = async (id: number): Promise<OrderData> => {
    try {
      const conn = await Client.connect();
      const sql = "SELECT id, status, user_id FROM orders WHERE id = ($1);";
      const result = await conn.query(sql, [id]);
      if (!result.rows.length) throw new Error("Order is not exists!");
      const order: Order = result.rows[0];
      const sqlDetail =
        "SELECT a.id, a.product_id, c.name product_name, a.quantity, c.price FROM orders_products a INNER JOIN orders b ON a.order_id = b.id INNER JOIN products c ON a.product_id = c.id WHERE b.id = ($1)";
      const detailOrder: DetailOrder[] = (await conn.query(sqlDetail, [id]))
        .rows;
      conn.release();
      const orderData = {
        id: order.id,
        status: order.status,
        user_id: order.user_id,
        details: detailOrder,
      };
      return orderData;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw err;
    }
  };
  create = async (ord: Order): Promise<Order> => {
    //check if user is valid
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users where id = ($1);";
      const result = await conn.query(sql, [ord.user_id]);
      if (!result.rows.length) throw new Error("Invalid user id");
    } catch (err) {
      if (err instanceof Error) throw new Error(`${err}`);
      else throw err;
    }
    //create new order
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO orders(status, user_id) VALUES ($1, $2) RETURNING *;";
      const result = await conn.query(sql, [ord.status, ord.user_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw err;
    }
  };
  addProduct = async (
    quantity: number,
    order_id: number,
    product_id: number
  ): Promise<{
    quantity: number;
    order_id: number;
    product_id: number;
  } | null> => {
    // get order to see if it is open
    console.log(quantity, order_id, product_id);
    try {
      const ordersql = "SELECT * FROM orders WHERE id=($1)";
      //@ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(ordersql, [order_id]);

      const order: Order = result.rows[0];
      conn.release();
      if (result.rows.length) {
        if (order.status !== "active") {
          throw new Error(
            `Could not add product ${product_id} to order ${order_id} because order status is ${order.status}`
          );
        }
      } else throw new Error("Order is not exist");
    } catch (err) {
      if (err instanceof Error) throw new Error(`${err}`);
      else throw err;
    }

    //check if product is valid
    try {
      const conn = await Client.connect();
      const productsql = "SELECT * FROM products where id = ($1);";

      const result = await conn.query(productsql, [product_id]);
      if (!result.rows.length) throw new Error("Invalid product id");
    } catch (err) {
      if (err instanceof Error) throw new Error(`${err}`);
      else throw err;
    }

    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO orders_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *;";
      const result = await conn.query(sql, [quantity, order_id, product_id]);
      conn.release();
      if (result.rows.length) return { quantity, order_id, product_id };
      return null;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw err;
    }
  };
}
