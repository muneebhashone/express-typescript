import "reflect-metadata";
import "dotenv/config";
import { get, set } from "lodash";
import { decode } from "./utils/jwt.utils";
import { resolvers } from "./resolver";
import express, { Express, Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { connectToDB } from "./utils/database";
import helmet from "helmet";
import cors from "cors";

async function bootstrap() {
  const schema = await buildSchema({ resolvers });

  const app: Express = express();

  app.use(helmet());
  app.use(cors({ origin: "*", credentials: true }));

  const server = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }) => {
      // Get the cookie from request
      const token =
        get(req, "cookies.token") || get(req, "headers.authorization");
      const user = token ? decode(token.replace(/^Bearer\s/, "")) : null;

      // Attach the user object to the request object
      if (user) {
        set(req, "user", user);
      }

      return { req, res };
    },
  });
  const port = process.env.PORT;
  await connectToDB();
  await server.start();

  server.applyMiddleware({ app });

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.listen(port, () => {
    console.log(`⚡️[Express]: Server is running at https://localhost:${port}`);
    console.log(
      `⚡️[GraphQL]: Server is running at https://localhost:${port}/graphql`
    );
  });
}

bootstrap();
