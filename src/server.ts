import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import userRoutes from "./handlers/user";
import productRoutes from "./handlers/product";
import orderRoutes from "./handlers/order";
import dashboardRoutes from "./handlers/dashboard";
import dotenv from "dotenv";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";
dotenv.config();

app.use(bodyParser.json());

app.get("/", function (_req: Request, res: Response) {
  res.send("Hello World");
});

//Routes
userRoutes(app);
productRoutes(app);
orderRoutes(app);
dashboardRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
