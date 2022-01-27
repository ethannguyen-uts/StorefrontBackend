import { ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';
import Client from '../../database';
import { OrderStore } from '../../models/order';
import { DashboardQueries } from '../../services/dashboard';

const productStore = new ProductStore();
const orderStore = new OrderStore();
const userStore = new UserStore();
const dashBoardQueries = new DashboardQueries();

let dashboardUser: User;

describe('Testing dashboard queries', () => {
  beforeAll(async () => {
    //create a dashboard user
    dashboardUser = await userStore.create({
      id: 61,
      first_name: 'dashboard',
      last_name: 'user',
      password: '123456',
    });

    const [soju, coke, fanta, pancake, donut, tomato] = await Promise.all([
      productStore.create({
        id: 71,
        name: 'soju',
        price: 11,
        category: 'Drink',
      }),
      productStore.create({
        id: 72,
        name: 'coke',
        price: 15,
        category: 'Drink',
      }),
      productStore.create({
        id: 73,
        name: 'fanta',
        price: 12,
        category: 'Drink',
      }),
      productStore.create({
        id: 81,
        name: 'pancake',
        price: 21,
        category: 'Food',
      }),
      productStore.create({
        id: 82,
        name: 'donut',
        price: 19,
        category: 'Food',
      }),
      productStore.create({
        id: 83,
        name: 'tomato',
        price: 22,
        category: 'Food',
      }),
    ]);

    //Create orders
    await Promise.all([
      orderStore.create({
        id: 1,
        status: 'active',
        user_id: dashboardUser.id!,
      }),
      orderStore.create({
        id: 2,
        status: 'active',
        user_id: dashboardUser.id!,
      }),
      orderStore.create({
        id: 3,
        status: 'active',
        user_id: dashboardUser.id!,
      }),
      orderStore.create({
        id: 4,
        status: 'complete',
        user_id: dashboardUser.id!,
      }),
      orderStore.create({
        id: 5,
        status: 'complete',
        user_id: dashboardUser.id!,
      }),
    ]);

    await Promise.all([
      orderStore.addProduct(5, 1, pancake.id!),
      orderStore.addProduct(20, 1, donut.id!),
      orderStore.addProduct(30, 1, tomato.id!),
      orderStore.addProduct(10, 2, soju.id!),
      orderStore.addProduct(20, 2, coke.id!),
      orderStore.addProduct(30, 2, fanta.id!),
      orderStore.addProduct(50, 3, fanta.id!),
    ]);
  });

  afterAll(async () => {
    //delete all users;
    const conn = await Client.connect();
    let sql = 'DELETE FROM orders_products;';
    await conn.query(sql);
    sql = 'DELETE FROM orders;';
    await conn.query(sql);
    sql = 'DELETE FROM products;';
    await conn.query(sql);
    sql = 'DELETE FROM users;';
    await conn.query(sql);
    //Reset the sequences
    sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });

  it('get top most popular products, expect success', async () => {
    const result = await dashBoardQueries.topPopularProducts();

    expect(result).toEqual([
      { id: 73, name: 'fanta', category: 'Drink', price: 12, quantity: 80 },
      { id: 83, name: 'tomato', category: 'Food', price: 22, quantity: 30 },
      { id: 82, name: 'donut', category: 'Food', price: 19, quantity: 20 },
      { id: 72, name: 'coke', category: 'Drink', price: 15, quantity: 20 },
      { id: 71, name: 'soju', category: 'Drink', price: 11, quantity: 10 },
    ]);
  });

  it('get products by category', async () => {
    const result = await dashBoardQueries.productsByCategory('Food');
    expect(result).toEqual([
      { id: 83, name: 'tomato', price: 22, category: 'Food' },
      { id: 82, name: 'donut', price: 19, category: 'Food' },
      { id: 81, name: 'pancake', price: 21, category: 'Food' },
    ]);
  });

  it('get the most recent active order by user', async () => {
    const result = await dashBoardQueries.currentOrderByUser(dashboardUser.id!);
    expect(result).toEqual({ id: 3, status: 'active', user_id: 61 });
  });
  it('get completed order by user', async () => {
    const result = await dashBoardQueries.completedOrdersByUser(
      dashboardUser.id!
    );
    expect(result).toEqual([
      { id: 5, status: 'complete', user_id: 61 },
      { id: 4, status: 'complete', user_id: 61 },
    ]);
  });
});
