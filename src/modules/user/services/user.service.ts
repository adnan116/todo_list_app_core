import { Service } from "typedi";
import {
  IPaginatedUsers,
  IUserLoginResponse,
  IUserPopulated,
  IUserSignupData,
  IUserSignupResponse,
} from "../interfaces/user.interface";
import BadRequestError from "../../../errors/bad-request.error";
import bcrypt from "bcryptjs";
import User from "../../../models/user";
import Role from "../../../models/role";
import jwt from "jsonwebtoken";
import { jwtSecret, tokenExpireTime } from "../../../configs/app.config";
import AuthError from "../../../errors/auth.error";
import mongoose from "mongoose";
import { connectDB } from "../../../configs/db";
import RoleFeature from "../../../models/role-feature";

@Service()
export class UserService {
  constructor() {}

  async registerUser(userInfo: IUserSignupData): Promise<IUserSignupResponse> {
    try {
      const {
        firstName,
        lastName,
        dob,
        phoneNumber,
        email,
        gender,
        religion,
        password,
        createdBy,
      } = userInfo;

      // Check if the email already exists in person_info
      const existingPerson = await User.findOne({ email });

      if (existingPerson) {
        throw new BadRequestError("Email already in use");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate dynamic username if not provided, or use the provided username
      const username =
        userInfo.username ||
        (await this.generateDynamicUsername(firstName, lastName));

      // Get the 'user' role
      const userRole = await Role.findOne({ role_name: "user" });
      if (!userRole) {
        throw new BadRequestError("User role not found");
      }

      // Create User entry
      const user = await User.create([
        {
          first_name: firstName,
          last_name: lastName,
          dob,
          phone_number: phoneNumber,
          email,
          gender,
          religion,
          username,
          password: hashedPassword,
          role_id: userRole._id,
          is_active: true,
          created_by: createdBy,
        },
      ]);
      // Prepare the response
      const userResponseInfo: IUserSignupResponse = {
        username: user[0].username,
        email: user[0].email,
      };
      return userResponseInfo;
    } catch (error) {
      throw error;
    }
  }

  async generateDynamicUsername(
    firstName: string,
    lastName: string
  ): Promise<string> {
    const baseName = `${firstName}${lastName}`.toLowerCase().replace(/\s/g, "");
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const username = `${baseName}${randomNum}`;

    return username.slice(0, 20);
  }

  async verifyUserLogin(
    username: string,
    password: string
  ): Promise<IUserLoginResponse> {
    try {
      // Find the user by username and populate the role based on `role_id`
      const user = await User.findOne({ username }).populate<{
        role_id: {
          id: string;
          role_name: string;
          features: { feature_name: string }[];
        };
      }>("role_id");

      if (!user) {
        throw new AuthError("User not found");
      }

      const roleId = user.role_id.id;

      const roleFeatures = await RoleFeature.find({
        role_id: roleId,
      }).populate<{ feature_id: { feature_name: string } }>(
        "feature_id",
        "feature_name"
      );

      // Extract feature names from the populated feature documents
      const permittedFeatures = roleFeatures.map(
        (rf) => rf.feature_id.feature_name
      );

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthError("Invalid credentials");
      }

      // Create JWT payload with user ID and role
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        roleId: user.role_id.id,
        userType: user.role_id.role_name,
      };

      const accessToken = jwt.sign(tokenPayload, jwtSecret as jwt.Secret, {
        expiresIn: tokenExpireTime,
      });

      // Prepare the login response
      const loginResponse: IUserLoginResponse = {
        accessToken,
        userName: user.username,
        userInfo: {
          firstName: user.first_name ?? null,
          lastName: user.last_name ?? null,
          email: user.email ?? null,
        },
        userType: user.role_id?.role_name ?? null,
        permittedFeatures,
      };

      return loginResponse;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters?: { [key: string]: any }
  ): Promise<IPaginatedUsers> {
    try {
      // Calculate the skip value for pagination
      const skip = (page - 1) * limit;

      // Build the query object
      const query: { [key: string]: any } = {};

      // If a search term is provided, add it to the query
      if (search) {
        query.$or = [
          { first_name: { $regex: search, $options: "i" } }, // Case-insensitive search
          { last_name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ];
      }

      // If additional filters are provided, add them to the query
      if (filters) {
        Object.assign(query, filters);
      }

      // Fetch users with pagination and populate the role
      const users = await User.find(query)
        .populate<{ role_id: { id: string; role_name: string } }>("role_id")
        .skip(skip)
        .limit(limit);

      // Get the total count of users based on the query
      const totalUsers = await User.countDocuments(query);

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalUsers / limit);

      // Return the paginated response
      return {
        users,
        currentPage: page,
        totalPages,
        totalUsers,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}
