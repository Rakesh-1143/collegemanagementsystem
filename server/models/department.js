import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  departmentCode: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("department", departmentSchema);
