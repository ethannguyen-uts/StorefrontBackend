import Client from "../database";
import { Order } from "../models/order";
import { Product } from "../models/product";

export class DashboardQueries {
  // Top 5 most popular products
  topPopularProducts = async (): Promise<
    {
      id: number;
      name: string;
      price: number;
      category: string;
      quantity: number;
    }[]
  > => {
    try {
      const conn = await Client.connect();
      const sql =
        "SELECT a.product_id id, MAX(b.name) name, MAX(b.category) category, MAX(b.price) price, SUM(a.quantity) quantity FROM orders_products a INNER JOIN products b ON a.product_id = b.id GROUP BY a.product_id ORDER BY quantity DESC LIMIT 5;";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get most popular products: ${err}`);
    }
  };
  //Products by category (args: product category)
  productsByCategory = async (
    category: string
  ): Promise<
    {
      id: number;
      name: string;
      price: number;
      category: string;
    }[]
  > => {
    try {
      const conn = await Client.connect();
      const sql =
        "SELECT id, name, price, category from products WHERE category = ($1) ORDER BY id DESC";
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (err) {
      if (err instanceof Error)
        throw new Error(`unable get products by category: ${err.message}`);
      else throw err;
    }
  };

  currentOrderByUser = async (user_id: number): Promise<Order> => {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql =
        "SELECT id, status, user_id FROM orders WHERE status = 'active' AND user_id = ($1) ORDER BY id DESC LIMIT 1";
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error)
        throw new Error(
          `unable get recent order of user ${user_id}: ${err.message}`
        );
      else throw err;
    }
  };
  completedOrdersByUser = async (user_id: number): Promise<Order[]> => {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql =
        "SELECT id, status, user_id FROM orders WHERE status = 'complete' AND user_id = ($1) ORDER BY id DESC";
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `unable get recent order of user ${user_id}: ${err.message}`
        );
      } else throw err;
    }
  };
}
