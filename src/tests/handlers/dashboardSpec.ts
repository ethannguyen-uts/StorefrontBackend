import supertest from 'supertest';
import { User, UserStore } from '../../models/user';
import app from '../../server';
import jwt from 'jsonwebtoken';
import Client from '../../database';

const store = new UserStore();
let token: string;
let adminUser: User;

const request = supertest(app);
describe('Testing dashboard endpoints', () => {
  beforeAll(async () => {
    adminUser = await store.create({
      id: 1,
      first_name: 'admin',
      last_name: 'admin',
      password: '123456',
    });
    const tokenSecret: string = process.env.TOKEN_SECRET as unknown as string;
    if (tokenSecret === undefined) {
      throw new Error('Token secret is not set');
    }
    token = jwt.sign({ user: adminUser }, tokenSecret);
  });

  afterAll(async () => {
    //delete all users;
    const conn = await Client.connect();
    let sql = 'DELETE FROM users;';
    await conn.query(sql);
    //Reset the sequences
    sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });

  it('get top most popular products endpoint, expect sucess', async () => {
    const response = await request.get('/top-popular-products');
    expect(response.status).toBe(200);
  });

  it('get products by category endpoint, expect sucess', async () => {
    const response = await request.post('/products-by-category').send('Food');

    expect(response.status).toBe(200);
  });
  it('get current order by user, expect sucess', async () => {
    const response = await request
      .post('/orders/users/1/current')
      .auth(token, { type: 'bearer' });
    expect(response.status).toBe(200);
  });

  it('get completed orders by user endpoint, expect sucess', async () => {
    const response = await request
      .post('/orders/users/1/complete')
      .auth(token, { type: 'bearer' });
    expect(response.status).toBe(200);
  });
});
