import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { User } from "./entity/User";
import { verify } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { createConnection } from "typeorm";
import { existsSync, mkdirSync } from "fs";
import { sendRefreshToken } from "./utils/auth";
import { createSchema } from "./utils/createSchema";
import { ApolloServer } from "apollo-server-express";
import { createAccessToken, createRefreshToken } from "./utils/auth";

(async () => {
  // initialize environment variables
  dotenv.config();

  existsSync(path.join(__dirname, "../files")) ||
    mkdirSync(path.join(__dirname, "../files"));

  // initialize express app
  const app = express();

  // app middleware
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(cookieParser());

  app.get("/", (_req, res) => res.send("graphql auth backend service"));
  app.use("/images", express.static(path.join(__dirname, "../images")));

  // automatically refresh token when current express
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.akid;

    // check if current token exists
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;

    // check if valid token
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    // token valid, check if user exists
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    // user signed out of all devices, different token version
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    // send refresh token
    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  // create connection to databse
  await createConnection();

  // create graphql schema
  const schema = await createSchema();

  // initialize apollo server
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  // start server
  app.listen(process.env.PORT, () => {
    console.log("express server started");
  });
})();
