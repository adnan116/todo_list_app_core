export interface ITaskCategory {
  id: string;
  categoryName: string;
  description: string;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface ITaskCategoryRequest {
  categoryName: string;
  description: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface ITaskCategoryResponse {
  id: string;
  categoryName: string;
  description: string;
  createdBy?: string | null;
}

export interface IPaginatedTaskCategories {
  categories: ITaskCategory[] | [];
  currentPage: number;
  totalPages: number;
  totalCategories: number;
}
