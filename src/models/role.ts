import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role_name: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  created_by: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String, required: false },
  updated_at: { type: Date, required: false },
});

const Role = mongoose.model("Role", roleSchema, "role");
export default Role;
