import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthToken } from './middleware';

const store = new ProductStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const listProduct: Product[] = await store.index();
    res.json(listProduct);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(err.message);
    } else throw new Error('Server error!');
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const prod: Product = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    //Check input parameter
    if (
      prod.id === undefined ||
      prod.name === undefined ||
      prod.price === undefined ||
      prod.category === undefined
    ) {
      throw new Error(
        'Missing products fields, please include id, name, price and category!'
      );
    }
    if (prod.name === '' || prod.category === '') {
      throw new Error('Product name and category must not be empty.');
    }
    if (prod.price <= 0) {
      throw new Error('Price must be greater than 0.');
    }

    const newProduct: Product = await store.create(prod);
    res.json(newProduct);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(err.message);
    } else throw new Error('Server error!');
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await store.show(id);
    res.json(product);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    } else throw new Error('Server error!');
  }
};

const productRoutes = (app: express.Application): void => {
  app.get('/products', index);
  app.post('/products', verifyAuthToken, create);
  app.get('/products/:id', verifyAuthToken, show);
};

export default productRoutes;
