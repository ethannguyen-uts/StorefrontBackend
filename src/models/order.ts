import Client from '../database';

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};
export type DetailOrder = {
  id: number;
  product_id: number;
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
      const sql = 'SELECT id, status, user_id FROM orders;';
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
      const sql = 'SELECT id, status, user_id FROM orders WHERE id = ($1);';
      const result = await conn.query(sql, [id]);
      if (!result.rows.length) throw new Error('Order is not exists!');
      const order: Order = result.rows[0];
      const sqlDetail =
        'SELECT a.id, a.product_id, c.name product_name, a.quantity, c.price FROM orders_products a INNER JOIN orders b ON a.order_id = b.id INNER JOIN products c ON a.product_id = c.id WHERE b.id = ($1)';
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
      const sqlCheck = 'SELECT id FROM users where id = ($1);';
      const checkUserResult = await conn.query(sqlCheck, [ord.user_id]);
      if (!checkUserResult.rows.length) throw new Error('Invalid user id');

      //create new order
      const sql =
        'INSERT INTO orders(id, status, user_id) VALUES ($1, $2, $3) RETURNING *;';
      const result = await conn.query(sql, [ord.id, ord.status, ord.user_id]);
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
    id: number;
    quantity: number;
    order_id: number;
    product_id: number;
  } | null> => {
    // get order to see if it is open
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const checkOrdersResult = await conn.query(ordersql, [order_id]);

      const order: Order = checkOrdersResult.rows[0];
      if (checkOrdersResult.rows.length) {
        if (order.status !== 'active') {
          throw new Error(
            `Could not add product ${product_id} to order ${order_id} because order status is ${order.status}`
          );
        }
      } else throw new Error('Order is not exist');

      //check if product is valid
      const productsql = 'SELECT * FROM products where id = ($1);';
      const checkProductResult = await conn.query(productsql, [product_id]);
      if (!checkProductResult.rows.length)
        throw new Error('Invalid product id');

      const sql =
        'INSERT INTO orders_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *;';
      const result = await conn.query(sql, [quantity, order_id, product_id]);

      conn.release();
      if (result.rows.length)
        return { id: result.rows[0].id, quantity, order_id, product_id };
      return null;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw err;
    }
  };
}
