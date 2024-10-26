import { Application } from "express";
import userRouter from "./routes/user.route";

export function init(app: Application) {
  app.use("/user", userRouter);
}
