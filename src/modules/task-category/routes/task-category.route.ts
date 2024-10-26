import express, { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { wrap } from "../../../middlewares/wraps.middle";
import { TaskCategoryService } from "../services/task-category.service";
import {
  authMiddleware,
  checkPermission,
} from "../../user/middlewares/auth.middle";
import {
  addCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} from "../validators/task-category.validator";
import { validates } from "../../../middlewares/express-validation.middle";
import { ITaskCategoryRequest } from "../interfaces/task-category.interface";

const router: Router = express.Router();

// Add a new Task Category
router.post(
  "/create",
  [authMiddleware, checkPermission("ADD_CATEGORY")],
  validates(addCategoryValidator),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const taskCategoryService = Container.get(TaskCategoryService);
    let newCategoryData: ITaskCategoryRequest = req.body;
    newCategoryData = { ...newCategoryData, createdBy: req.user.username };
    const newCategory = await taskCategoryService.addTaskCategory(
      newCategoryData
    );
    res.status(201).json({
      message: "Task category created successfully",
      data: newCategory,
    });
  })
);

// Get All Task Categories with Pagination and Search
router.get(
  "/list",
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, search } = req.query;
    const taskCategoryService: TaskCategoryService =
      Container.get(TaskCategoryService);
    const categories = await taskCategoryService.getTaskCategories(
      Number(page),
      Number(limit),
      search as string
    );
    res.status(200).json({
      message: "Task categories retrieved successfully",
      data: categories,
    });
  })
);

// Update a Task Category
router.put(
  "/update/:id",
  [authMiddleware, checkPermission("UPDATE_CATEGORY")],
  validates(updateCategoryValidator),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let updateData: ITaskCategoryRequest = req.body;
    updateData = {
      ...updateData,
      updatedBy: req.user.username,
      updatedAt: new Date(),
    };
    const taskCategoryService = Container.get(TaskCategoryService);
    const updatedCategory = await taskCategoryService.updateTaskCategory(
      id,
      updateData
    );
    res.status(200).json({
      message: "Task category updated successfully",
      data: updatedCategory,
    });
  })
);

// Delete a Task Category
router.delete(
  "/delete/:id",
  [authMiddleware, checkPermission("DELETE_CATEGORY")],
  validates(deleteCategoryValidator),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const taskCategoryService = Container.get(TaskCategoryService);
    await taskCategoryService.deleteTaskCategory(id);
    res.status(200).json({
      message: "Task category deleted successfully",
    });
  })
);

export default router;
