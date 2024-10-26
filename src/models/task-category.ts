import mongoose from "mongoose";

const taskCategorySchema = new mongoose.Schema({
  category_name: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  created_by: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String, required: false },
  updated_at: { type: Date, required: false },
});

const TaskCategory = mongoose.model(
  "TaskCategory",
  taskCategorySchema,
  "task_category"
);
export default TaskCategory;
