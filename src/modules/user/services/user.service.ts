import { Service } from "typedi";
import {
  IRoleResponse,
  IUserLoginResponse,
  IUserResponse,
  IUserSignupData,
  IUserSignupResponse,
  IUserUpdateData,
} from "../interfaces/user.interface";
import BadRequestError from "../../../errors/bad-request.error";
import bcrypt from "bcryptjs";
import User from "../../../models/user";
import Role from "../../../models/role";
import jwt from "jsonwebtoken";
import { jwtSecret, tokenExpireTime } from "../../../configs/app.config";
import AuthError from "../../../errors/auth.error";
import RoleFeature from "../../../models/role-feature";
import { toCamelKeys } from "keys-transform";
import mongoose from "mongoose";

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
          password: hashedPassword,
          role_id: userRole._id,
          is_active: true,
          created_by: createdBy,
        },
      ]);

      const userResponseInfo: IUserSignupResponse = {
        email: user[0].email,
      };
      return userResponseInfo;
    } catch (error) {
      throw error;
    }
  }

  async verifyUserLogin(
    username: string,
    password: string
  ): Promise<IUserLoginResponse> {
    try {
      // Find the user by username and populate the role based on `role_id`
      const user = await User.findOne({ email: username }).populate<{
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

      // Create JWT payload with user ID, role and userType
      const tokenPayload = {
        userId: user.id,
        roleId: user.role_id.id,
        userType: user.role_id.role_name,
      };

      const accessToken = jwt.sign(tokenPayload, jwtSecret as jwt.Secret, {
        expiresIn: tokenExpireTime,
      });

      const loginResponse: IUserLoginResponse = {
        accessToken,
        userInfo: {
          userId: user.id,
          firstName: user.first_name ?? null,
          lastName: user.last_name ?? null,
          email: user.email ?? null,
        },
        userType: user.role_id?.role_name ?? null,
        permittedFeatures,
      };

      return loginResponse;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters?: { [key: string]: any }
  ) {
    try {
      const skip = (page - 1) * limit;
      const query: { [key: string]: any } = {};

      // If a search term is provided and is not empty, add it to the query
      if (search && search.trim() !== "") {
        const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.$or = [
          { first_name: { $regex: safeSearch, $options: "i" } },
          { last_name: { $regex: safeSearch, $options: "i" } },
          { email: { $regex: safeSearch, $options: "i" } },
          { username: { $regex: safeSearch, $options: "i" } },
        ];
      }

      if (filters) {
        Object.assign(query, filters);
      }

      const users = await User.find(query)
        .populate<{
          role_id: { _id: mongoose.Types.ObjectId; role_name: string };
        }>("role_id", "role_name")
        .skip(skip)
        .limit(limit)
        .lean();

      const userList = users.map((user) => ({
        ...toCamelKeys(user),
        id: (user._id as mongoose.Types.ObjectId).toString(),
        roleId: user.role_id
          ? {
              id: (user.role_id._id as mongoose.Types.ObjectId).toString(),
              roleName: user.role_id.role_name,
            }
          : null,
      }));

      const totalUsers = await User.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / limit);

      return {
        users: userList,
        currentPage: page,
        totalPages,
        totalUsers,
      };
    } catch (error) {
      throw error;
    }
  }

  async addUser(userInfo: IUserSignupData) {
    const {
      firstName,
      lastName,
      dob,
      phoneNumber,
      email,
      gender,
      religion,
      password,
      roleId,
      createdBy,
    } = userInfo;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the role
    const role = await Role.findOne({ _id: roleId });
    if (!role) {
      throw new BadRequestError("Role not found");
    }

    // Create the user
    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      dob,
      phone_number: phoneNumber,
      email,
      gender,
      religion,
      password: hashedPassword,
      role_id: role._id,
      is_active: true,
      created_by: createdBy,
    });

    return {
      id: newUser._id,
      email: newUser.email,
    };
  }

  async updateUser(userId: string, userInfo: IUserUpdateData) {
    const updateData: IUserUpdateData = { ...userInfo };

    if (userInfo.password) {
      updateData.password = await bcrypt.hash(userInfo.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        first_name: updateData?.firstName,
        last_name: updateData?.lastName,
        dob: updateData?.dob,
        phone_number: updateData?.phoneNumber,
        email: updateData?.email,
        gender: updateData?.gender,
        religion: updateData?.religion,
        password: updateData?.password,
        role_id: updateData?.roleId,
        is_active: true,
        updated_by: updateData?.updatedBy,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      throw new BadRequestError("User not found");
    }

    return {
      id: updatedUser._id,
      email: updatedUser.email,
    };
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new BadRequestError("User not found");
      }

      // Delete the user from the database
      await User.findByIdAndDelete(userId);
    } catch (error) {
      throw error;
    }
  }

  // get all roles
  async getAllRoles(): Promise<IRoleResponse[]> {
    try {
      const roles = await Role.find({}, "_id role_name");
      const roleResponse: IRoleResponse[] = roles.map((role) => ({
        id: role._id.toString(),
        roleName: role.role_name,
      }));
      return roleResponse;
    } catch (error) {
      throw error;
    }
  }

  // get all users without pagination
  async getAllUsers(): Promise<IUserResponse[]> {
    try {
      const users = await User.find({}, "_id first_name last_name");
      const usersResponse: IUserResponse[] = users.map((user) => ({
        id: (user._id as mongoose.Types.ObjectId).toString(),
        firstName: user.first_name,
        lastName: user.last_name,
      }));
      return usersResponse;
    } catch (error) {
      throw error;
    }
  }
}
