import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "branch",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },
  courseType: {
    type: String,
  },
  duration: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

courseSchema.index({ department: 1, branch: 1 });
courseSchema.index({ courseName: 1 });

export default mongoose.model("course", courseSchema);
