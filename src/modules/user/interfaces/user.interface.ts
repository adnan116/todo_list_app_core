import { IUser } from "../../../models/user";

export interface IUserPopulated extends IUser {
  role: {
    id: string;
    role_name: string;
  };
  person_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    dob: Date;
  };
}

export interface IUserSignupData {
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: string;
  email: string;
  gender: string;
  religion: string;
  password: string;
  roleId?: string;
  createdBy: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface IUserUpdateData {
  firstName?: string;
  lastName?: string;
  dob?: Date;
  phoneNumber?: string;
  email?: string;
  gender?: string;
  religion?: string;
  password: string;
  roleId: string;
  updatedBy: string;
}

export interface IUserSignupResponse {
  id?: string | null;
  email?: string | null;
}

export interface IUserLoginResponse {
  accessToken: string;
  userType: string;
  permittedFeatures: string[];
  userInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface IPaginatedUsers {
  users: IUser[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export interface userTokenData {
  userId: string;
  roleId: string;
  userType: string;
}
