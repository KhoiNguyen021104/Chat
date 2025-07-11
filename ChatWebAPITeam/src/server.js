import express from "express";
import cors from "cors";
import { CLOSED_DB, CONNECT_DB } from "./config/database";
import exitHook from "async-exit-hook";
import { env } from "./config/environment";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
import cookieParser from "cookie-parser";
import http from 'http'
import { initSocket } from "./socket/socket";
import responseMiddleware from "./middlewares/responseMiddleware";

let app;
const START_SERVER = () => {
  app = express();

  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  app.use(cookieParser());

  app.use(cors(corsOptions));

  app.use(express.json({ limit: "1000mb" }));
  app.use(express.urlencoded({ limit: "1000mb", extended: true }));
  app.use(responseMiddleware);

  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  const server = http.createServer(app)
  initSocket(server, corsOptions);
  

  server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`http://${env.APP_HOST}:${env.APP_PORT}`);
  });

  exitHook(() => {
    CLOSED_DB();
  });
};
(async () => {
  try {
    await CONNECT_DB();
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();

export { app };
