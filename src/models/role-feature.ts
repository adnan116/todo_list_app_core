import mongoose from "mongoose";

const roleFeatureSchema = new mongoose.Schema({
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  feature_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feature",
    required: true,
  },
});

const RoleFeature = mongoose.model(
  "RoleFeature",
  roleFeatureSchema,
  "role_feature"
);
export default RoleFeature;
