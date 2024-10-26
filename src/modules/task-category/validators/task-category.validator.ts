import { body, param } from "express-validator";

export const addCategoryValidator = [
  body("categoryName")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
];

export const updateCategoryValidator = [
  param("id")
    .notEmpty()
    .withMessage("Task Category ID is required")
    .isMongoId()
    .withMessage("Task Category ID must be a valid Mongo ID"),
  body("categoryName")
    .optional()
    .isString()
    .withMessage("Category name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

export const deleteCategoryValidator = [
  param("id")
    .notEmpty()
    .withMessage("Task Category ID is required")
    .isMongoId()
    .withMessage("Task Category ID must be a valid Mongo ID"),
];
