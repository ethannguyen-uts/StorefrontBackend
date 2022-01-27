import Client from '../database';
import bcrypt from 'bcrypt';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password?: string;
  password_digest?: string;
};

export class UserStore {
  index = async (): Promise<User[]> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT id, first_name, last_name FROM users;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  };

  create = async (a: User): Promise<User> => {
    try {
      const pepper: string = BCRYPT_PASSWORD ? BCRYPT_PASSWORD : '';
      const saltRounds: number = SALT_ROUNDS ? parseInt(SALT_ROUNDS) : 1;
      const sql =
        'INSERT INTO users (id, first_name, last_name, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(a.password + pepper, saltRounds);
      const result = await conn.query(sql, [
        a.id,
        a.first_name,
        a.last_name,
        hash,
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not add user ${a.first_name}. Error: ${err}`);
    }
  };

  show = async (id: number): Promise<User | null> => {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT id, first_name, last_name FROM users WHERE id = ($1);';
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else return null;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  };

  remove = async (id?: number): Promise<void> => {
    try {
      const conn = await Client.connect();
      let sql = `DELETE FROM users`;
      if (id) {
        sql += ` WHERE id = ($1);`;
        await conn.query(sql, [id]);
      } else {
        sql += ';';
        await conn.query(sql);
      }
      conn.release();
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  };

  update = async (a: User): Promise<User> => {
    try {
      const pepper: string = BCRYPT_PASSWORD ? BCRYPT_PASSWORD : '';
      const saltRounds: number = SALT_ROUNDS ? parseInt(SALT_ROUNDS) : 1;
      const sql =
        'UPDATE users SET first_name = $2, last_name = $3, password_digest = $4 WHERE id = $1 RETURNING *';
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(a.password + pepper, saltRounds);
      const result = await conn.query(sql, [
        a.id,
        a.first_name,
        a.last_name,
        hash,
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not update user: userId ${a.id}}. Error: ${err}`);
    }
  };

  authenticate = async (
    first_name: string,
    last_name: string,
    password: string
  ): Promise<User | null> => {
    try {
      const pepper: string = BCRYPT_PASSWORD ? BCRYPT_PASSWORD : '';
      const sql =
        'SELECT id, first_name, last_name, password_digest FROM users WHERE first_name=($1) AND last_name=($2);';
      const conn = await Client.connect();
      const result = await conn.query(sql, [first_name, last_name]);
      conn.release();
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(
        `Could not authenticate user ${first_name}. Error: ${err}`
      );
    }
  };

  checkExistUser = async (
    first_name: string,
    last_name: string
  ): Promise<boolean> => {
    try {
      const sql =
        'SELECT id, first_name, last_name FROM users WHERE first_name=($1) and last_name=($2);';
      const conn = await Client.connect();
      const result = await conn.query(sql, [first_name, last_name]);
      conn.release();
      if (result.rows.length) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(
        `Could not check exists user ${first_name}. Error: ${err}`
      );
    }
  };
}
