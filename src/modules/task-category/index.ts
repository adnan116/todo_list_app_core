import { Application } from "express";
import taskCategoryRouter from "./routes/task-category.route";

export function init(app: Application) {
  app.use("/task-category", taskCategoryRouter);
}
