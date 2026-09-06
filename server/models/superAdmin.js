import mongoose from "mongoose";

const superAdminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
    avatar: {
      type: String,
    },
    passwordUpdated: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { strict: false }
);

export default mongoose.model("superadmin", superAdminSchema);
