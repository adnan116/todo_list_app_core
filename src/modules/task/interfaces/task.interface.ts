import mongoose from "mongoose";

export interface ITaskRequest {
  id?: string;
  title: string;
  description: string;
  status: string;
  deadline?: string;
  categoryId?: {
    id?: string;
    categoryName?: string;
  };
  userId?: {
    id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface ITaskResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline?: string;
  categoryId?: mongoose.Schema.Types.ObjectId;
  userId?: mongoose.Schema.Types.ObjectId;
}

export interface IPaginatedTasks {
  tasks: ITaskRequest[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

export interface IInnerCategoryAndUser {
  _id: mongoose.Types.ObjectId;
  category_name?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}
