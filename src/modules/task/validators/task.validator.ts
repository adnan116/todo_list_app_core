import { body, query, param } from "express-validator";

export const addTaskValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("status").notEmpty().withMessage("Status is required"),
  body("deadline")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),
  body("categoryId").optional().isMongoId().withMessage("Invalid category ID"),
  body("userId").optional().isMongoId().withMessage("Invalid user ID"),
];

export const updateTaskValidator = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("status").notEmpty().withMessage("Status is required"),
  body("deadline")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),
  body("categoryId").optional().isMongoId().withMessage("Invalid category ID"),
  body("userId").optional().isMongoId().withMessage("Invalid user ID"),
];

export const getTasksValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("search").optional().isString().withMessage("Search must be a string"),
  query("categoryId").optional().isMongoId().withMessage("Invalid category ID"),
  query("userId").optional().isMongoId().withMessage("Invalid user ID"),
];

export const deleteTaskValidator = [
  param("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid task ID"),
];
