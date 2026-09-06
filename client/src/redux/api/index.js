import axios from "axios";
import store from "../store";
import { LOGOUT } from "../actionTypes";
import { getToken, clearToken } from "../token";

// Base URL is configurable via REACT_APP_SERVER_URL (see client/.env.example).
const API = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5001/",
  withCredentials: true, // send/receive the httpOnly auth cookie
});

// Timestamp of the current login. Requests that began BEFORE the login (e.g.
// the on-load /api/me session restore, which can be slow when the Render
// backend is cold) may come back 401 after the login already succeeded. Those
// stale 401s must not wipe the fresh session.
let sessionStartedAt = 0;

API.interceptors.request.use((config) => {
  config.startedAt = Date.now();
  // Cross-site-safe auth: the session JWT rides in an Authorization header
  // (works even when the browser blocks the third-party httpOnly cookie).
  const token = getToken();
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    const { url = "", method = "" } = response.config || {};
    if (String(method).toLowerCase() === "post" && url.includes("/login")) {
      sessionStartedAt = response.config?.startedAt || Date.now();
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    // Treat a 401 as session expiry (cookie missing/expired/invalid) ONLY when
    // the request was issued after the current login. Clear the client-side
    // session then so the route guards redirect to the login page instead of
    // leaving the user on a protected page staring at a cryptic
    // "Unauthenticated" error. Login requests are excluded (wrong credentials
    // are a normal 401/404). Stale pre-login 401s are ignored.
    if (
      status === 401 &&
      !url.includes("/login") &&
      (error.config?.startedAt || 0) > sessionStartedAt
    ) {
      clearToken();
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(error);
  }
);

// Session (cookie based)
export const fetchMe = () => API.get("/api/me");
export const logout = () => API.post("/api/logout");

// Admin

export const adminSignIn = (formData) => API.post("/api/admin/login", formData);

export const adminUpdatePassword = (updatedPassword) =>
  API.post("/api/admin/updatepassword", updatedPassword);

export const getAllStudent = () => API.get("/api/admin/getallstudent");

export const getAllDepartment = () => API.get("/api/admin/getalldepartment");

export const getAllFaculty = () => API.get("/api/admin/getallfaculty");
export const getAllSubject = () => API.get("/api/admin/getallsubject");

export const updateAdmin = (updatedAdmin) =>
  API.post("/api/admin/updateprofile", updatedAdmin);

export const createNotice = (notice) =>
  API.post("/api/admin/createnotice", notice);

export const deleteFaculty = (data) =>
  API.post("/api/admin/deletefaculty", data);
export const deleteStudent = (data) =>
  API.post("/api/admin/deletestudent", data);
export const deleteSubject = (data) =>
  API.post("/api/admin/deletesubject", data);



export const addFaculty = (faculty) =>
  API.post("/api/admin/addfaculty", faculty);

export const getFaculty = (department) =>
  API.post("/api/admin/getfaculty", department);

export const addSubject = (addSubject) => API.post("/api/admin/addsubject", addSubject);
export const getSubject = (subject) => API.post("/api/admin/getsubject", subject);
export const updateSubject = (subject) => API.post("/api/admin/updatesubject", subject);
export const getSubjectsByCourse = (data) => API.post("/api/admin/getsubjectsbycourse", data);
export const editFaculty = (faculty) => API.post("/api/admin/editfaculty", faculty);
export const addStudent = (addStudent) => API.post("/api/admin/addstudent", addStudent);

export const getStudent = (student) =>
  API.post("/api/admin/getstudent", student);
export const getNotice = (notice) => API.post("/api/admin/getnotice", notice);

export const addBranch = (branch) => API.post("/api/admin/addbranch", branch);
export const getBranches = () => API.get("/api/admin/getbranches");
export const updateBranch = (branch) => API.post("/api/admin/updatebranch", branch);
export const deleteBranch = (branchId) => API.post("/api/admin/deletebranch", { _id: branchId });

export const addCourse = (course) => API.post("/api/admin/addcourse", course);
export const getCourses = () => API.get("/api/admin/getcourses");
export const updateCourse = (course) => API.post("/api/admin/updatecourse", course);
export const deleteCourse = (courseId) => API.post("/api/admin/deletecourse", { _id: courseId });

// Super Admin
export const superAdminSignIn = (formData) => API.post("/api/superadmin/login", formData);
export const superAdminUpdatePassword = (updatedPassword) => API.post("/api/superadmin/updatepassword", updatedPassword);
export const updateSuperAdmin = (updatedSuperAdmin) => API.post("/api/superadmin/updateprofile", updatedSuperAdmin);
export const addAdmin = (admin) => API.post("/api/superadmin/addadmin", admin);
export const deleteAdmin = (data) => API.post("/api/superadmin/deleteadmin", data);
export const getAdmin = (admin) => API.post("/api/superadmin/getadmin", admin);
export const updateAdminStatus = (data) => API.post("/api/superadmin/updateadminstatus", data);
export const editAdmin = (data) => API.post("/api/superadmin/editadmin", data);

export const addDepartment = (department) => API.post("/api/superadmin/adddepartment", department);
export const deleteDepartment = (data) => API.post("/api/superadmin/deletedepartment", data);
export const editDepartment = (data) => API.post("/api/superadmin/editdepartment", data);
export const updateDepartmentStatus = (data) => API.post("/api/superadmin/updatedepartmentstatus", data);
export const getUnassignedAdmins = () => API.get("/api/superadmin/getunassignedadmins");
export const getSuperAdminAllDepartment = () => API.get("/api/superadmin/getalldepartment");

// Faculty

export const facultySignIn = (formData) =>
  API.post("/api/faculty/login", formData);

export const facultyUpdatePassword = (updatedPassword) =>
  API.post("/api/faculty/updatepassword", updatedPassword);

export const updateFaculty = (updatedFaculty) =>
  API.post("/api/faculty/updateprofile", updatedFaculty);

export const createTest = (test) => API.post("/api/faculty/createtest", test);
export const getTest = (test) => API.post("/api/faculty/gettest", test);
export const getMarksStudent = (student) =>
  API.post("/api/faculty/getstudent", student);
export const uploadMarks = (data) => API.post("/api/faculty/uploadmarks", data);
export const markAttendance = (data) =>
  API.post("/api/faculty/markattendance", data);
export const getMySubjects = () => API.get("/api/faculty/mysubjects");
export const getMyStudents = () => API.get("/api/faculty/mystudents");

// Student

export const studentSignIn = (formData) =>
  API.post("/api/student/login", formData);

export const studentUpdatePassword = (updatedPassword) =>
  API.post("/api/student/updatepassword", updatedPassword);

export const updateStudent = (updatedStudent) =>
  API.post("/api/student/updateprofile", updatedStudent);
export const getTestResult = (testResult) =>
  API.post("/api/student/testresult", testResult);
export const getAttendance = (attendance) =>
  API.post("/api/student/attendance", attendance);