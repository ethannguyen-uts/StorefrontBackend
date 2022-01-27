import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import { verifyAuthToken } from './middleware';

const dashboardRoutes = (app: express.Application) => {
  app.post(
    '/orders/users/:id/complete',
    verifyAuthToken,
    completedOrdersByUser
  );
  app.post('/orders/users/:id/current', verifyAuthToken, currentOrderByUser);
  app.get('/top-popular-products', topPopularProducts);
  app.post('/products-by-category', productsByCategory);
};

const dashboard = new DashboardQueries();

const topPopularProducts = async (_req: Request, res: Response) => {
  const products = await dashboard.topPopularProducts();
  res.json(products);
};

const productsByCategory = async (req: Request, res: Response) => {
  const category = req.body.category as unknown as string;
  const products = await dashboard.productsByCategory(category);
  res.json(products);
};

const currentOrderByUser = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.id) as unknown as number;

  const order = await dashboard.currentOrderByUser(user_id);
  res.json(order);
};

const completedOrdersByUser = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.id) as unknown as number;
  const orders = await dashboard.completedOrdersByUser(user_id);
  res.json(orders);
};

export default dashboardRoutes;
