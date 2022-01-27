import supertest from 'supertest';
import { UserStore } from '../../models/user';
import app from '../../server';
import jwt from 'jsonwebtoken';
import Client from '../../database';

const userStore = new UserStore();
let token: string;

const request = supertest(app);
describe('Testing products endpoints', () => {
  beforeAll(async () => {
    const adminUser = await userStore.create({
      id: 41,
      first_name: 'product',
      last_name: 'user',
      password: '123456',
    });
    const tokenSecret: string = process.env.TOKEN_SECRET as unknown as string;
    if (tokenSecret === undefined) {
      throw new Error('Token secret is not set');
    }
    token = jwt.sign({ user: adminUser }, tokenSecret);
  });

  afterAll(async () => {
    const conn = await Client.connect();

    //delete all users;
    let sql = 'DELETE FROM users;';
    await conn.query(sql);
    //Reset the sequences
    sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });

  it('create product endpoint, expect sucess', async () => {
    const product = {
      id: 41,
      name: 'test 41',
      price: 10,
      category: 'Food',
    };
    const response = await request
      .post('/products')
      .auth(token, { type: 'bearer' })
      .send(product);
    expect(response.status).toBe(200);
  });

  it('index product endpoint, expect sucess', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 41,
        name: 'test 41',
        price: 10,
        category: 'Food',
      },
    ]);
  });
});
