import mongoose, { Document } from "mongoose";

interface IRolePopulated {
  id: string;
  role_name: string;
}

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  dob: Date;
  phone_number: string;
  email: string;
  gender: string;
  religion: string;
  password: string;
  is_active: boolean;
  role_id: mongoose.Types.ObjectId | IRolePopulated;
  created_by?: string;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  dob: { type: Date, required: false },
  phone_number: { type: String, required: false },
  email: { type: String, required: false },
  gender: { type: String, required: false },
  religion: { type: String, required: false },
  password: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  created_by: { type: String },
  updated_by: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

// Export the model
const User = mongoose.model<IUser>("User", userSchema, "user");
export default User;
