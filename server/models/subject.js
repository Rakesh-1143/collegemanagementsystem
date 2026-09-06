import mongoose from "mongoose";
const { Schema } = mongoose;
const subjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "branch",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "course",
  },
  totalLectures: {
    type: Number,
    default: 10,
  },
  year: {
    type: String,
    required: true,
  },
  attendence: {
    type: Schema.Types.ObjectId,
    ref: "attendence",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

subjectSchema.index({ department: 1, year: 1 });
subjectSchema.index({ branch: 1, course: 1 });
subjectSchema.index({ subjectCode: 1 });

export default mongoose.model("subject", subjectSchema);
