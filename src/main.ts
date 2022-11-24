import "reflect-metadata";
import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { connectToDB } from "./utils/database";
import helmet from "helmet";
import cors from "cors";

async function bootstrap() {
  const app: Express = express();

  app.use(helmet());
  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());

  const port = process.env.PORT;
  await connectToDB();

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.listen(port, () => {
    console.log(`⚡️[Express]: Server is running at http://localhost:${port}`);
  });
}

bootstrap();
