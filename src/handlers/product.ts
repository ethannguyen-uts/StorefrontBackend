import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import { verifyAuthToken } from "./middleware";

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  const listProduct: Product[] = await store.index();
  res.json(listProduct);
};

const create = async (req: Request, res: Response) => {
  try {
    const prod: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    //Check input parameter
    if (
      prod.name === undefined ||
      prod.price === undefined ||
      prod.category === undefined
    ) {
      throw new Error(
        "Missing products fields, please include name, price and category!"
      );
    }
    if (prod.name === "" || prod.category === "") {
      throw new Error("Product name and category must not be empty.");
    }
    if (prod.price <= 0) {
      throw new Error("Price must be greater than 0.");
    }

    const newProduct: Product = await store.create(prod);
    res.json(newProduct);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(err.message);
    }
  }
};

const productRoutes = (app: express.Application) => {
  app.get("/products", index);
  app.post("/products", verifyAuthToken, create);
};

export default productRoutes;
