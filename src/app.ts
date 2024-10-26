import { json, urlencoded } from "body-parser";
import cors from "cors";
import "reflect-metadata";
import express, { Application } from "express";
import * as http from "http";
import moment from "moment-timezone";
import { defaultDateFormat, defaultTimezone } from "./configs/app.config";
import { errorHandler } from "./middlewares/error-handler.middle";
import { connectDB } from "./configs/db";

// importing modules
import * as userModule from "./modules/user";
import * as taskCategoryModule from "./modules/task-category";
import * as taskModule from "./modules/task";

export default async function appFactory(): Promise<Application> {
  // express app init
  const app: Application = express();

  // enabling cors
  app.use(cors());

  //fixed timezone
  moment().tz(defaultTimezone).format(defaultDateFormat);

  // body parser config
  const jsonParser: any = json({
    inflate: true,
    limit: "10mb",
    type: "application/json",
    verify: (
      req: http.IncomingMessage,
      res: http.ServerResponse,
      buf: Buffer,
      encoding: string
    ) => {
      return true;
    },
  });

  // Sync the models after the connection is established
  await connectDB();

  // using json parser and urlencoder
  app.use(jsonParser);
  app.use(urlencoded({ extended: true }));

  // for handling uncaught exception from application
  process.on("uncaughtException", (err) => {
    throw new Error(`[ERROR] Uncaught Exception : ${err.message}`);
  });

  process.on("unhandledRejection", (error: any) => {
    throw new Error(`[ERROR] From event: ${error?.toString()}`);
  });

  /**
   * Register Modules
   */
  userModule.init(app);
  taskCategoryModule.init(app);
  taskModule.init(app);

  /**
   * Register Error Handler
   */
  app.use(errorHandler as any);

  return app;
}
