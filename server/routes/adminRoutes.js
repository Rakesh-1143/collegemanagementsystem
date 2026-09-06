import express from "express";
import auth, { requireRole } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import {
  adminLogin,
  updateAdmin,
  addFaculty,
  getFaculty,
  addSubject,
  getSubject,
  addStudent,
  getStudent,
  getAllStudent,
  getAllFaculty,
  getAllSubject,
  getAllDepartment,
  updatedPassword,
  deleteFaculty,
  deleteStudent,
  deleteSubject,
  updateSubject,
  createNotice,
  getNotice,
  addBranch,
  getBranches,
  deleteBranch,
  updateBranch,
  addCourse,
  getCourses,
  deleteCourse,
  updateCourse,
  editFaculty,
  getSubjectsByCourse,
} from "../controller/adminController.js";
const router = express.Router();

router.post("/login", loginLimiter, adminLogin);
router.post("/updatepassword", auth, requireRole("admin"), updatedPassword);
router.get("/getallstudent", auth, requireRole("admin"), getAllStudent);
router.post("/createnotice", auth, requireRole("admin"), createNotice);
router.get("/getallfaculty", auth, requireRole("admin"), getAllFaculty);
router.get("/getallsubject", auth, requireRole("admin"), getAllSubject);
router.get("/getalldepartment", auth, requireRole("admin"), getAllDepartment);
router.post("/updateprofile", auth, requireRole("admin"), updateAdmin);
router.post("/addfaculty", auth, requireRole("admin"), addFaculty);
router.post("/getfaculty", auth, requireRole("admin"), getFaculty);
router.post("/editfaculty", auth, requireRole("admin"), editFaculty);
router.post("/getsubjectsbycourse", auth, requireRole("admin", "faculty", "student"), getSubjectsByCourse);
router.post("/addsubject", auth, requireRole("admin"), addSubject);
router.post("/updatesubject", auth, requireRole("admin"), updateSubject);
// Shared read-only lookup: also used by faculty (mark attendance) and students (subject list).
router.post(
  "/getsubject",
  auth,
  requireRole("admin", "faculty", "student"),
  getSubject
);
router.post("/addstudent", auth, requireRole("admin"), addStudent);
router.post("/getstudent", auth, requireRole("admin"), getStudent);
// Notices are visible to every role (admin, faculty and students).
router.post("/getnotice", auth, requireRole("admin", "faculty", "student"), getNotice);
router.post("/deletefaculty", auth, requireRole("admin"), deleteFaculty);
router.post("/deletestudent", auth, requireRole("admin"), deleteStudent);
router.post("/deletesubject", auth, requireRole("admin"), deleteSubject);

// Branch Management
router.post("/addbranch", auth, requireRole("admin"), addBranch);
router.get("/getbranches", auth, requireRole("admin"), getBranches);
router.post("/updatebranch", auth, requireRole("admin"), updateBranch);
router.post("/deletebranch", auth, requireRole("admin"), deleteBranch);

// Course Management
router.post("/addcourse", auth, requireRole("admin"), addCourse);
router.get("/getcourses", auth, requireRole("admin"), getCourses);
router.post("/updatecourse", auth, requireRole("admin"), updateCourse);
router.post("/deletecourse", auth, requireRole("admin"), deleteCourse);

export default router;