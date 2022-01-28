import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const sql = 'SELECT id, name, price, category FROM products;';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw err;
    }
  }
  async create(pro: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      let sql = 'SELECT id FROM products WHERE id = ($1)';
      const checkResult = await conn.query(sql, [pro.id]);
      if (checkResult.rows.length)
        throw new Error('Product is is already exist in the database');
      sql =
        'INSERT INTO products(id, name, price, category) VALUES ($1, $2, $3, $4) RETURNING *;';
      const result = await conn.query(sql, [
        pro.id,
        pro.name,
        pro.price,
        pro.category,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw err;
    }
  }

  show = async (id: number): Promise<Product | null> => {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT id, name, price, category FROM products WHERE id = ($1);';
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else return null;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw err;
    }
  };
}
