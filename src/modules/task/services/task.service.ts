import { Service } from "typedi";
import Task from "../../../models/task";
import {
  IInnerCategoryAndUser,
  IPaginatedTasks,
  ITaskRequest,
  ITaskResponse,
} from "../interfaces/task.interface";
import BadRequestError from "../../../errors/bad-request.error";
import { toCamelKeys } from "keys-transform";
import mongoose from "mongoose";
import TaskCategory from "../../../models/task-category";
import User from "../../../models/user";

@Service()
export class TaskService {
  constructor() {}

  // Add a new task
  async addTask(data: ITaskRequest): Promise<ITaskResponse> {
    try {
      const {
        title,
        description,
        status,
        deadline,
        categoryId,
        userId,
        createdBy,
      } = data;

      // Check if task title already exists
      const existingTask = await Task.findOne({ title });
      if (existingTask) {
        throw new BadRequestError("Task title already exists");
      }

      // Check if the category exists
      const existingCategory = await TaskCategory.findById(categoryId);
      if (!existingCategory) {
        throw new BadRequestError("Category does not exist");
      }

      // Check if the user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        throw new BadRequestError("User does not exist");
      }

      // Create new task
      const newTask = new Task({
        title,
        description,
        status,
        deadline,
        category_id: categoryId,
        user_id: userId,
        created_by: createdBy,
      });

      const savedTask = await newTask.save();

      return {
        id: savedTask.id,
        title: savedTask.title,
        description: savedTask.description,
        status: savedTask.status,
        deadline: savedTask.deadline,
        categoryId: savedTask.category_id,
        userId: savedTask.user_id,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all tasks with filtering, searching, and pagination
  async getTasks(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters?: { categoryId?: string; userId?: string }
  ): Promise<IPaginatedTasks> {
    const skip = (page - 1) * limit;
    const query: { [key: string]: any } = {};

    // If a search term is provided, add it to the query
    if (search && search.trim() !== "") {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (filters?.categoryId) {
      query.category_id = filters.categoryId;
    }
    if (filters?.userId) {
      query.user_id = filters.userId;
    }

    const tasksList = await Task.find(query)
      .skip(skip)
      .limit(limit)
      .populate<{ category_id: IInnerCategoryAndUser }>(
        "category_id",
        "category_name"
      )
      .populate<{ user_id: IInnerCategoryAndUser }>(
        "user_id",
        "username first_name last_name"
      )
      .lean();

    // Manually handle conversion to camel case and ensure ObjectId fields are converted to strings
    const tasks = tasksList.map((task) => {
      const transformedTask = toCamelKeys(task);
      return {
        ...transformedTask,
        id: (task._id as mongoose.Types.ObjectId).toString(),
        categoryId: task.category_id
          ? {
              id: (task.category_id._id as mongoose.Types.ObjectId).toString(),
              categoryName: task.category_id.category_name,
            }
          : null,
        userId: task.user_id
          ? {
              id: (task.user_id._id as mongoose.Types.ObjectId).toString(),
              username: task.user_id.username,
              firstName: task.user_id.first_name,
              lastName: task.user_id.last_name,
            }
          : null,
      };
    });

    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limit);

    return {
      tasks: tasks as ITaskRequest[],
      currentPage: page,
      totalPages,
      totalTasks,
    };
  }

  // Update a task
  async updateTask(id: string, data: ITaskRequest): Promise<ITaskResponse> {
    try {
      const {
        title,
        description,
        status,
        deadline,
        categoryId,
        userId,
        updatedBy,
      } = data;

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        {
          title,
          description,
          status,
          deadline,
          category_id: categoryId,
          user_id: userId,
          updated_by: updatedBy,
          updated_at: new Date(),
        },
        { new: true }
      );

      if (!updatedTask) {
        throw new BadRequestError("Task not found");
      }

      return {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        deadline: updatedTask.deadline,
        categoryId: updatedTask.category_id,
        userId: updatedTask.user_id,
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    try {
      const task = await Task.findById(id);
      if (!task) {
        throw new BadRequestError("Task not found");
      }

      await Task.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
