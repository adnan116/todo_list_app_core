import express, { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { wrap } from "../../../middlewares/wraps.middle";
import { UserService } from "../services/user.service";
import { validates } from "../../../middlewares/express-validation.middle";
import {
  userLoginValidation,
  userSignUpValidation,
  userUpdateValidation,
} from "../validators/user.validator";
import { authMiddleware, checkPermission } from "../middlewares/auth.middle";
import { IUserSignupData, IUserUpdateData } from "../interfaces/user.interface";

const router: Router = express.Router();

// Sign up/ Add API for new users
router.post(
  "/sign-up",
  validates(userSignUpValidation),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const userSignupData = req.body;
    const userService: UserService = Container.get(UserService);
    const user = await userService.registerUser(userSignupData);
    res.status(201).json({
      message: "User created successfully",
      data: {
        id: user?.id,
        email: user?.email,
      },
    });
  })
);

// Login API
router.post(
  "/login",
  validates(userLoginValidation),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const userService: UserService = Container.get(UserService);
    const user = await userService.verifyUserLogin(username, password);

    res.status(200).json({
      message: "User login successful",
      data: user,
    });
  })
);

// Get users API with pagination
router.get(
  "/list",
  [authMiddleware, checkPermission("GET_USER")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, search, ...filters } = req.query;

    // Convert query string filters to the expected format
    const parsedFilters: { [key: string]: any } = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        parsedFilters[key] = filters[key];
      }
    });

    const userService = Container.get(UserService);
    const users = await userService.getUsers(
      Number(page),
      Number(limit),
      search as string,
      parsedFilters
    );

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  })
);

// Add User API for Admin
router.post(
  "/create",
  [authMiddleware, checkPermission("ADD_USER")],
  validates(userSignUpValidation),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const userService: UserService = Container.get(UserService);
    let userData: IUserSignupData = {
      ...req.body,
      createdBy: req.user.userId,
    };
    const newUser = await userService.addUser(userData);
    res.status(201).json({
      message: "User added successfully",
      data: newUser,
    });
  })
);

// Update User API
router.put(
  "/update/:userId",
  [authMiddleware, checkPermission("UPDATE_USER")],
  validates(userUpdateValidation),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const userService: UserService = Container.get(UserService);
    let updateUserData: IUserUpdateData = {
      ...req.body,
      updatedBy: req.user.userId,
    };
    const updatedUser = await userService.updateUser(userId, updateUserData);
    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  })
);

// Delete User API
router.delete(
  "/delete/:id",
  [authMiddleware, checkPermission("DELETE_USER")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userService: UserService = Container.get(UserService);
    await userService.deleteUser(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  })
);

// Get all roles
router.get(
  "/all-roles",
  [authMiddleware, checkPermission("ADD_USER")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const userService = Container.get(UserService);
    const roles = await userService.getAllRoles();

    res.status(200).json({
      message: "Roles retrieved successfully",
      data: roles,
    });
  })
);

export default router;
