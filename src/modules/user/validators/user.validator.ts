import { body } from "express-validator";

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
];

export const userLoginValidation = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];
