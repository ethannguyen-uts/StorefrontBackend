import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import { verifyAuthToken } from './middleware';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const listUser: User[] = await store.index();
    res.json(listUser);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    }
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const u: User = {
      id: req.body.id as unknown as number,
      first_name: req.body.first_name as unknown as string,
      last_name: req.body.last_name as unknown as string,
      password: req.body.password as unknown as string,
    };
    //Check input parameter
    if (
      u.id === undefined ||
      u.first_name === undefined ||
      u.last_name === undefined ||
      u.password === undefined
    ) {
      throw new Error(
        'User id, first name, last name and password must be included'
      );
    }

    if (u.first_name === '' || u.last_name === '') {
      throw new Error('User first name and last name must not be empty.');
    }
    if (u.password === '' || u.password.length < 6) {
      throw new Error('Invalid password.');
    }
    //Check if user is already exist
    const isExistUser = await store.checkExistUser(u.first_name, u.last_name);
    if (isExistUser)
      throw new Error(`User already exists, can not create user`);

    //create new user and sign the token
    const user = await store.create(u);
    const tokenSecret: string = process.env.TOKEN_SECRET as unknown as string;
    if (tokenSecret === undefined) {
      throw new Error('Token secret is not set');
    }
    const token = jwt.sign({ user: user }, tokenSecret);
    res.json({ token: token });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    }
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    }
  }
};

const update = async (req: Request, res: Response) => {
  const user: User = {
    id: parseInt(req.params.id),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
  };

  try {
    const updatedUser = await store.update(user);
    res.json(updatedUser);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err.message);
    }
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.post('/users', create);
  app.post('/users/:id', verifyAuthToken, show);
  app.put('/users/:id', verifyAuthToken, update);
};

export default userRoutes;
