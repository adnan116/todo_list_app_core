import express, { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { wrap } from "../../../middlewares/wraps.middle";
import { UserService } from "../services/user.service";
import {
  IUserSignupData,
  IUserSignupResponse,
} from "../interfaces/user.interface";
import { validates } from "../../../middlewares/express-validation.middle";
import {
  userLoginValidation,
  userSignUpValidation,
} from "../validators/user.validator";
import { authMiddleware, checkPermission } from "../middlewares/auth.middle";

const router: Router = express.Router();

// Sign up API for users
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
        username: user?.username,
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
      message: "Login successful",
      data: user,
    });
  })
);

router.get(
  "/list",
  [authMiddleware, checkPermission("GET_USER")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    const userService = Container.get(UserService);
    const users = await userService.getUsers(Number(page), Number(limit));

    res.status(200).json({
      message: "Request successful",
      data: users,
    });
  })
);

export default router;
