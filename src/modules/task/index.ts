import { Application } from "express";
import taskRouter from "./routes/task.route";

export function init(app: Application) {
  app.use("/task", taskRouter);
}
