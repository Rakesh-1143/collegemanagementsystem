import express from "express";
import {
  facultyLogin,
  updatedPassword,
  updateFaculty,
  createTest,
  getTest,
  getStudent,
  uploadMarks,
  markAttendance,
  getMySubjects,
  getMyStudents,
} from "../controller/facultyController.js";
import auth, { requireRole } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, facultyLogin);
router.post("/updatepassword", auth, requireRole("faculty"), updatedPassword);
router.post("/updateprofile", auth, requireRole("faculty"), updateFaculty);
router.post("/createtest", auth, requireRole("faculty"), createTest);
router.post("/gettest", auth, requireRole("faculty"), getTest);
router.post("/getstudent", auth, requireRole("faculty"), getStudent);
router.post("/uploadmarks", auth, requireRole("faculty"), uploadMarks);
router.post("/markattendance", auth, requireRole("faculty"), markAttendance);
router.get("/mysubjects", auth, requireRole("faculty"), getMySubjects);
router.get("/mystudents", auth, requireRole("faculty"), getMyStudents);

export default router;