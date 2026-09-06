import express from "express";
import auth, { requireRole } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import {
  superAdminLogin,
  updateSuperAdminPassword,
  updateSuperAdminProfile,
  addAdmin,
  getAdmin,
  deleteAdmin,
  updateAdminStatus,
  editAdmin,
  addDepartment,
  editDepartment,
  deleteDepartment,
  updateDepartmentStatus,
  getAllDepartment,
  getUnassignedAdmins,
} from "../controller/superAdminController.js";
const router = express.Router();

router.post("/login", loginLimiter, superAdminLogin);
router.post("/updatepassword", auth, requireRole("superadmin"), updateSuperAdminPassword);
router.post("/updateprofile", auth, requireRole("superadmin"), updateSuperAdminProfile);
router.post("/addadmin", auth, requireRole("superadmin"), addAdmin);
router.post("/getadmin", auth, requireRole("superadmin"), getAdmin);
router.post("/deleteadmin", auth, requireRole("superadmin"), deleteAdmin);
router.post("/updateadminstatus", auth, requireRole("superadmin"), updateAdminStatus);
router.post("/editadmin", auth, requireRole("superadmin"), editAdmin);

router.post("/adddepartment", auth, requireRole("superadmin"), addDepartment);
router.post("/editdepartment", auth, requireRole("superadmin"), editDepartment);
router.post("/deletedepartment", auth, requireRole("superadmin"), deleteDepartment);
router.post("/updatedepartmentstatus", auth, requireRole("superadmin"), updateDepartmentStatus);
router.get("/getalldepartment", auth, requireRole("superadmin"), getAllDepartment);
router.get("/getunassignedadmins", auth, requireRole("superadmin"), getUnassignedAdmins);

export default router;
