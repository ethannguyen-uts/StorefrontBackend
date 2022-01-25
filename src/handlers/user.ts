import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken";
import { verifyAuthToken, isOwnUser } from "./middleware";

const store = new UserStore();

const index = async (req: Request, res: Response) => {
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
      first_name: req.body.first_name as unknown as string,
      last_name: req.body.last_name as unknown as string,
      password: req.body.password as unknown as string,
    };
    //Check input parameter
    if (
      u.first_name === undefined ||
      u.last_name === undefined ||
      u.password === undefined
    ) {
      throw new Error("User name and password is not included!");
    }
    if (u.first_name === "" || u.last_name === "") {
      throw new Error("User first name and last name must not be empty.");
    }
    if (u.password === "" || u.password.length < 6) {
      throw new Error("Invalid password.");
    }
    //Check if user is already exist
    const isExistUser = await store.checkExistUser(u.first_name, u.last_name);
    if (isExistUser)
      throw new Error(`User already exists, can not create user`);

    //create new user and sign the token
    const user = await store.create(u);
    const tokenSecret: string = process.env.TOKEN_SECRET as unknown as string;
    if (tokenSecret === undefined) {
      throw new Error("Token secret is not set");
    }
    const token = jwt.sign({ user: user }, tokenSecret);
    res.json(token);
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

const authenticate = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const first_name: string = req.body.first_name as unknown as string;
    const last_name: string = req.body.last_name as unknown as string;
    const password: string = req.body.password as unknown as string;

    const user = await store.authenticate(id, first_name, last_name, password);
    if (user === null) throw new Error("Authentication failed!");
    const tokenSecret: string = process.env.TOKEN_SECRET as unknown as string;
    if (tokenSecret === undefined) {
      throw new Error("Token secret is not set");
    }
    const token = jwt.sign({ user: user }, tokenSecret);
    res.json(token);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      res.status(400);
      res.json(err.message);
    }
  }
};

const update = async (req: Request, res: Response) => {
  const user: User = {
    id: parseInt(req.params.id),
    first_name: req.body.username,
    last_name: req.body.username,
    password: req.body.password,
  };

  try {
    const updated = await store.update(user);
    res.json(updated);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400);
      res.json(err);
    }
  }
};

const userRoutes = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.post("/users", create);
  app.post("/users/:id", verifyAuthToken, show);
  app.post("/users/:id/authenticate", authenticate);
  app.put("/users/:id", update);
};

export default userRoutes;