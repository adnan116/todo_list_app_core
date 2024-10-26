import express, { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { wrap } from "../../../middlewares/wraps.middle";
import { TaskService } from "../services/task.service";
import {
  authMiddleware,
  checkPermission,
} from "../../user/middlewares/auth.middle";
import { validates } from "../../../middlewares/express-validation.middle";
import {
  addTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
  getTasksValidator,
} from "../validators/task.validator";
import { ITaskRequest } from "../interfaces/task.interface";

const router: Router = express.Router();

// Add a new Task
router.post(
  "/create",
  [authMiddleware, checkPermission("ADD_TASK")],
  validates(addTaskValidator),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    let taskCreateData: ITaskRequest = req.body;
    taskCreateData = { ...taskCreateData, createdBy: req.user.username };
    const taskService = Container.get(TaskService);
    const task = await taskService.addTask(taskCreateData);
    res.status(201).json({
      message: "Task created successfully",
      data: task,
    });
  })
);

// Get All Task with Pagination, search and filter
router.get(
  "/list",
  [authMiddleware, checkPermission("GET_TASK")],
  validates(getTasksValidator),
  wrap(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, ...filters } = req.query;
    const taskService = Container.get(TaskService);
    const tasks = await taskService.getTasks(
      Number(page),
      Number(limit),
      search as string,
      filters
    );
    res.status(200).json({
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  })
);

// Update a Task
router.put(
  "/update/:id",
  [authMiddleware, checkPermission("UPDATE_TASK")],
  validates(updateTaskValidator),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let taskUpdateData: ITaskRequest = req.body;
    taskUpdateData = {
      ...taskUpdateData,
      updatedBy: req.user.username,
    };
    const taskService = Container.get(TaskService);
    const updatedTask = await taskService.updateTask(id, taskUpdateData);
    res.status(200).json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  })
);

// Delete a Task
router.delete(
  "/delete/:id",
  [authMiddleware, checkPermission("DELETE_TASK")],
  validates(deleteTaskValidator),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const taskService = Container.get(TaskService);
    await taskService.deleteTask(id);
    res.status(200).json({
      message: "Task deleted successfully",
    });
  })
);

export default router;
