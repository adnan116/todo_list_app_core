import { Service } from "typedi";
import TaskCategory from "../../../models/task-category";
import BadRequestError from "../../../errors/bad-request.error";
import {
  IPaginatedTaskCategories,
  ITaskCategory,
  ITaskCategoryRequest,
  ITaskCategoryResponse,
} from "../interfaces/task-category.interface";
import { toCamelKeys } from "keys-transform";

@Service()
export class TaskCategoryService {
  constructor() {}

  // Add a new task category
  async addTaskCategory(
    data: ITaskCategoryRequest
  ): Promise<ITaskCategoryResponse> {
    try {
      const { categoryName, description, createdBy } = data;

      // Check if category name already exists
      const existingCategory = await TaskCategory.findOne({
        category_name: categoryName,
      });
      if (existingCategory) {
        throw new BadRequestError("Category name already exists");
      }

      // Create new task category
      const newCategory = new TaskCategory({
        category_name: categoryName,
        description,
        created_by: createdBy,
      });

      const savedCategory = await newCategory.save();

      return {
        id: savedCategory.id,
        categoryName: savedCategory.category_name,
        description: savedCategory.description,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all task categories
  async getTaskCategories(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<IPaginatedTaskCategories> {
    const skip = (page - 1) * limit;
    const query: { [key: string]: any } = {};

    // If a search term is provided, add it to the query
    if (search && search.trim() !== "") {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { category_name: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const categoriesList = await TaskCategory.find(query)
      .skip(skip)
      .limit(limit)
      .lean();
    const modifiedCategories = categoriesList.map((category) => ({
      ...toCamelKeys(category),
      id: category._id.toString(),
    }));

    const totalCategories = await TaskCategory.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);

    return {
      categories: modifiedCategories as ITaskCategory[],
      currentPage: page,
      totalPages,
      totalCategories,
    };
  }

  // Update a task category
  async updateTaskCategory(
    id: string,
    data: ITaskCategoryRequest
  ): Promise<ITaskCategoryResponse> {
    try {
      const { categoryName, description, updatedBy } = data;

      const updatedCategory = await TaskCategory.findByIdAndUpdate(
        id,
        {
          category_name: categoryName,
          description,
          updated_by: updatedBy,
          updated_at: new Date(),
        },
        { new: true }
      );

      if (!updatedCategory) {
        throw new BadRequestError("Task category not found");
      }

      return {
        id: updatedCategory.id,
        categoryName: updatedCategory.category_name,
        description: updatedCategory.description,
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete a task category
  async deleteTaskCategory(id: string): Promise<void> {
    try {
      const category = await TaskCategory.findById(id);
      if (!category) {
        throw new BadRequestError("Task category not found");
      }

      await TaskCategory.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // get all task categories without pagination
  async getAllTaskCategories(): Promise<ITaskCategoryResponse[]> {
    try {
      const TaskCategories = await TaskCategory.find({}, "_id category_name");
      const TaskCategoriesResponse: ITaskCategoryResponse[] =
        TaskCategories.map((taskCategory) => ({
          id: taskCategory._id.toString(),
          categoryName: taskCategory.category_name,
        }));
      return TaskCategoriesResponse;
    } catch (error) {
      throw error;
    }
  }
}
