import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  deadline?: string;
  category_id?: mongoose.Schema.Types.ObjectId;
  user_id?: mongoose.Schema.Types.ObjectId;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  deadline: { type: Date, required: false },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskCategory",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  created_by: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String, required: false },
  updated_at: { type: Date, required: false },
});

const Task = mongoose.model<ITask>("Task", taskSchema, "task");
export default Task;
