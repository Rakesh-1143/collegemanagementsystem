import mongoose from "mongoose";

const branchSchema = mongoose.Schema({
  branchName: {
    type: String,
    required: true,
  },
  branchCode: {
    type: String,
  },
  description: {
    type: String,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

branchSchema.index({ department: 1 });
branchSchema.index({ branchName: 1 });

export default mongoose.model("branch", branchSchema);
