import express, { Request, Response } from 'express';
import { Order, OrderData, OrderStore } from '../models/order';
import { verifyAuthToken } from './middleware';

const store: OrderStore = new OrderStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  const orders = await store.index();
  res.json(orders);
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const newOrder = {
      id: req.body.id,
      status: req.body.status,
      user_id: req.body.user_id,
    };
    //Check input parameter
    if (newOrder.status === undefined || newOrder.user_id === undefined) {
      throw new Error(
        'Missing orders fields, please include status and user id!'
      );
    }
    if (newOrder.status === '') {
      throw new Error('Status must not be empty.');
    }
    if (!(newOrder.status === 'active' || newOrder.status === 'complete')) {
      throw new Error("Status must be 'active' or 'complete'");
    }
    const order: Order = await store.create(newOrder);
    res.json(order);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    } else throw new Error('Server error!');
  }
};
const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id);
    const orderData: OrderData = await store.show(orderId);
    res.json(orderData);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    } else throw new Error('Server error!');
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  const order_id: number = parseInt(req.params.id);
  const product_id: number = parseInt(req.body.product_id);
  const quantity: number = parseInt(req.body.quantity);
  //Check input parameter
  if (
    order_id === undefined ||
    product_id === undefined ||
    quantity === undefined
  ) {
    throw new Error('Missing fields, please include productId and quantity!');
  }
  try {
    const addedProduct = await store.addProduct(quantity, order_id, product_id);
    if (addProduct === null) {
      res.status(500).json('Server error');
      return;
    }
    res.json(addedProduct);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    } else throw new Error('Server error!');
  }
};

const orderRoutes = (app: express.Application): void => {
  app.get('/orders', index);
  app.post('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
};

export default orderRoutes;
