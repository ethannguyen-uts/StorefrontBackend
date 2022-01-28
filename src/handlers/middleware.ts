import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyAuthToken = (
  req: Request,
  res: Response,
  next: () => void
): Response<void> | undefined => {
  try {
    const requestHeaderToken: string = req.headers
      .authorization as unknown as string;
    const token: string = requestHeaderToken.split(' ')[1];
    const tokenSecret = process.env.TOKEN_SECRET as unknown as string;
    jwt.verify(token, tokenSecret);
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401);
      return res.json('Access denied, invalid token:' + err.message);
    }
  }
};

const isOwnUser = (
  req: Request,
  res: Response,
  next: () => void
): Response<void> | undefined => {
  try {
    const user: { id: number; password: string } = {
      id: parseInt(req.params.id),
      password: req.body.password,
    };
    const requestHeaderToken: string = req.headers
      .authorization as unknown as string;
    const token: string = requestHeaderToken.split(' ')[1];
    const tokenSecret = process.env.TOKEN_SECRET as unknown as string;
    const decoded = jwt.verify(token, tokenSecret);
    if (typeof decoded === 'string' || decoded.user.id !== user.id) {
      throw new Error('User id does not match!');
    }
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401);
      return res.json('Access denied, invalid token:' + err.message);
    }
  }
};

export { verifyAuthToken, isOwnUser };
