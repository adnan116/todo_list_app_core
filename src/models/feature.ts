import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  feature_name: { type: String, unique: true, required: true },
  is_active: { type: Boolean, required: false, default: true },
  created_by: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String, required: false },
  updated_at: { type: Date, required: false },
});

const Feature = mongoose.model("Feature", featureSchema, "feature");
export default Feature;
