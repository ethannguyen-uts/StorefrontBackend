import supertest from 'supertest';
import { UserStore } from '../../models/user';
import app from '../../server';
import jwt from 'jsonwebtoken';
import Client from '../../database';

const store = new UserStore();
let token: string;

const request = supertest(app);
describe('Testing users endpoints', () => {
  beforeAll(async () => {
    const adminUser = await store.create({
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

  it('create user endpoint, expect sucess', async () => {
    const user = {
      id: 100,
      first_name: 'Tom',
      last_name: 'Holland',
      password: '123456',
    };
    const response = await request.post('/users').send(user);

    expect(response.status).toBe(200);
  });

  it('index user endpoint, expect sucess', async () => {
    const response = await request
      .get('/users')
      .auth(token, { type: 'bearer' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        first_name: 'admin',
        last_name: 'admin',
      },
      {
        id: 100,
        first_name: 'Tom',
        last_name: 'Holland',
      },
    ]);
  });

  it('show user endpoint, expect sucess', async () => {
    const response = await request
      .post('/users/1')
      .auth(token, { type: 'bearer' });
    expect(response.status).toBe(200);
  });

  it('update user endpoint, expect sucess', async () => {
    const user = {
      id: 100,
      first_name: 'Tom',
      last_name: 'Holland2',
      password: '654321',
    };
    const response = await request
      .put('/users/100')
      .auth(token, { type: 'bearer' })
      .send(user);
    expect(response.status).toBe(200);
  });
});
