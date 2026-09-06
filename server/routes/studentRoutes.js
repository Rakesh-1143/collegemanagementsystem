import express from "express";
import {
  studentLogin,
  updatedPassword,
  updateStudent,
  testResult,
  attendance,
} from "../controller/studentController.js";
import auth, { requireRole } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, studentLogin);
router.post("/updatepassword", auth, requireRole("student"), updatedPassword);
router.post("/updateprofile", auth, requireRole("student"), updateStudent);
router.post("/testresult", auth, requireRole("student"), testResult);
router.post("/attendance", auth, requireRole("student"), attendance);

export default router;