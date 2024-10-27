import { body, param } from "express-validator";

export const userSignUpValidation = [
  body("firstName")
    .isString()
    .notEmpty()
    .withMessage("First name is required."),
  body("lastName").isString().notEmpty().withMessage("Last name is required."),
  body("dob")
    .isDate()
    .withMessage("Date of birth is required and must be a valid date."),
  body("phoneNumber")
    .isString()
    .notEmpty()
    .withMessage("Phone number is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("gender").isString().notEmpty().withMessage("Gender is required."),
  body("religion").isString().notEmpty().withMessage("Religion is required."),
  body("profilePicture")
    .optional()
    .isString()
    .withMessage("Profile picture must be a string."),
  body("password").isString().notEmpty().withMessage("Password is required."),
  body("roleId").optional().isMongoId().withMessage("Invalid role ID"),
];

export const userLoginValidation = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

export const userUpdateValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be valid"),
  body("lastName").optional().isString().withMessage("Last name must be valid"),
  body("dob")
    .optional()
    .isDate()
    .withMessage("Date of Birth must be a valid date"),
  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone number must be valid"),
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender is invalid"),
  body("religion").optional().isString().withMessage("Religion must be valid"),
  body("roleId").optional().isMongoId().withMessage("Invalid role ID"),
];
