import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import { verifyAuthToken } from './middleware';

const dashboardRoutes = (app: express.Application) => {
  app.get('/orders/users/:id/complete', verifyAuthToken, completedOrdersByUser);
  app.get('/orders/users/:id/current', verifyAuthToken, currentOrderByUser);
  app.get('/top-popular-products', topPopularProducts);
  app.get('/products-by-category/:category', productsByCategory);
};

const dashboard = new DashboardQueries();

const topPopularProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await dashboard.topPopularProducts();
    res.json(products);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    } else throw new Error('Server error!');
  }
};

const productsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = req.params.category as unknown as string;
    const products = await dashboard.productsByCategory(category);
    res.json(products);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    } else throw new Error('Server error!');
  }
};

const currentOrderByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = parseInt(req.params.id) as unknown as number;
    const order = await dashboard.currentOrderByUser(user_id);
    res.json(order);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    } else throw new Error('Server error!');
  }
};

const completedOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = parseInt(req.params.id) as unknown as number;
    const orders = await dashboard.completedOrdersByUser(user_id);
    res.json(orders);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    } else throw new Error('Server error!');
  }
};

export default dashboardRoutes;
