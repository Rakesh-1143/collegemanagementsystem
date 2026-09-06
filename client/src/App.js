import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { restoreSession } from "./redux/actions/authActions";
import GlobalSnackbar from "./components/common/GlobalSnackbar";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const SuperAdminLogin = lazy(() => import("./components/login/superAdminLogin/SuperAdminLogin"));
const SuperAdminHome = lazy(() => import("./components/superAdmin/SuperAdminHome"));
const SuperAdminProfile = lazy(() => import("./components/superAdmin/profile/Profile"));
const SuperAdminUpdate = lazy(() => import("./components/superAdmin/profile/update/Update"));
const SuperAdminPassword = lazy(() => import("./components/superAdmin/profile/update/password/Password"));
const SuperAdminFirstTimePassword = lazy(() => import("./components/superAdmin/profile/update/firstTimePassword/FirstTimePassword"));
const SuperAdminAddAdmin = lazy(() => import("./components/superAdmin/addAdmin/AddAdmin"));
const SuperAdminDeleteAdmin = lazy(() => import("./components/superAdmin/deleteAdmin/DeleteAdmin"));
const SuperAdminManageAdmin = lazy(() => import("./components/superAdmin/manageAdmin/ManageAdmin"));
const SuperAdminAddDepartment = lazy(() => import("./components/superAdmin/addDepartment/AddDepartment"));
const SuperAdminManageDepartment = lazy(() => import("./components/superAdmin/manageDepartment/ManageDepartment"));

const AddFaculty = lazy(() => import("./components/admin/addFaculty/AddFaculty"));
const AddStudent = lazy(() => import("./components/admin/addStudent/AddStudent"));
const AddSubject = lazy(() => import("./components/admin/addSubject/AddSubject"));
const AdminHome = lazy(() => import("./components/admin/AdminHome"));

const GetFaculty = lazy(() => import("./components/admin/getFaculty/GetFaculty"));
const GetStudent = lazy(() => import("./components/admin/getStudent/GetStudent"));
const GetSubject = lazy(() => import("./components/admin/getSubject/GetSubject"));
const AddBranch = lazy(() => import("./components/admin/addBranch/AddBranch"));
const GetBranch = lazy(() => import("./components/admin/getBranch/GetBranch"));
const AddCourse = lazy(() => import("./components/admin/addCourse/AddCourse"));
const GetCourse = lazy(() => import("./components/admin/getCourse/GetCourse"));
const AdminProfile = lazy(() => import("./components/admin/profile/Profile"));
const AdminFirstTimePassword = lazy(() => import("./components/admin/profile/update/firstTimePassword/FirstTimePassword"));
const AdminPassword = lazy(() => import("./components/admin/profile/update/password/Password"));

const AdminUpdate = lazy(() => import("./components/admin/profile/update/Update"));
const CreateTest = lazy(() => import("./components/faculty/createTest/CreateTest"));
const FacultyHome = lazy(() => import("./components/faculty/FacultyHome"));
const MarkAttendance = lazy(() => import("./components/faculty/markAttendance/MarkAttendance"));
const FacultyProfile = lazy(() => import("./components/faculty/profile/Profile"));
const FacultyFirstTimePassword = lazy(() => import("./components/faculty/profile/update/firstTimePassword/FirstTimePassword"));
const FacultyPassword = lazy(() => import("./components/faculty/profile/update/password/Password"));
const FacultyUpdate = lazy(() => import("./components/faculty/profile/update/Update"));
const UploadMarks = lazy(() => import("./components/faculty/uploadMarks/UploadMarks"));
const MySubjects = lazy(() => import("./components/faculty/mySubjects/MySubjects"));
const MyStudents = lazy(() => import("./components/faculty/myStudents/MyStudents"));
const AdminLogin = lazy(() => import("./components/login/adminLogin/AdminLogin"));
const FacultyLogin = lazy(() => import("./components/login/facultyLogin/FacultyLogin"));
const Login = lazy(() => import("./components/login/Login"));

const StudentLogin = lazy(() => import("./components/login/studentLogin/StudentLogin"));
const StudentFirstTimePassword = lazy(() => import("./components/student/profile/update/firstTimePassword/FirstTimePassword"));
const StudentHome = lazy(() => import("./components/student/StudentHome"));
const StudentProfile = lazy(() => import("./components/student/profile/Profile"));
const StudentUpdate = lazy(() => import("./components/student/profile/update/Update"));
const StudentPassword = lazy(() => import("./components/student/profile/update/password/Password"));
const SubjectList = lazy(() => import("./components/student/subjectList/SubjectList"));
const TestResult = lazy(() => import("./components/student/testResult/TestResult"));
const Attendance = lazy(() => import("./components/student/attendance/Attendance"));
const DeleteFaculty = lazy(() => import("./components/admin/deleteFaculty/DeleteFaculty"));
const DeleteStudent = lazy(() => import("./components/admin/deleteStudent/DeleteStudent"));
const DeleteSubject = lazy(() => import("./components/admin/deleteSubject/DeleteSubject"));
const CreateNotice = lazy(() => import("./components/admin/createNotice/CreateNotice"));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();

  // Restore the session from the httpOnly cookie on every page load.
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalSnackbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route exact path="/" element={<Login />} />

          <Route path="/login/superadminlogin" element={<SuperAdminLogin />} />
          <Route path="/superadmin/home" element={<SuperAdminHome />} />
          <Route path="/superadmin/profile" element={<SuperAdminProfile />} />
          <Route path="/superadmin/update" element={<SuperAdminUpdate />} />
          <Route path="/superadmin/update/password" element={<SuperAdminPassword />} />
          <Route path="/superadmin/updatepassword" element={<SuperAdminFirstTimePassword />} />
          <Route path="/superadmin/addadmin" element={<SuperAdminAddAdmin />} />
          <Route path="/superadmin/deleteadmin" element={<SuperAdminDeleteAdmin />} />
          <Route path="/superadmin/manageadmin" element={<SuperAdminManageAdmin />} />
          <Route path="/superadmin/adddepartment" element={<SuperAdminAddDepartment />} />
          <Route path="/superadmin/managedepartment" element={<SuperAdminManageDepartment />} />

          {/* Admin  */}

          <Route path="/login/adminlogin" element={<AdminLogin />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/update" element={<AdminUpdate />} />
          <Route path="/admin/update/password" element={<AdminPassword />} />
          <Route
            path="/admin/updatepassword"
            element={<AdminFirstTimePassword />}
          />
          <Route path="/admin/createnotice" element={<CreateNotice />} />
          <Route path="/admin/addfaculty" element={<AddFaculty />} />
          <Route path="/admin/deletefaculty" element={<DeleteFaculty />} />
          <Route path="/admin/deletestudent" element={<DeleteStudent />} />
          <Route path="/admin/deletesubject" element={<DeleteSubject />} />
          <Route path="/admin/allfaculty" element={<GetFaculty />} />
          <Route path="/admin/addstudent" element={<AddStudent />} />
          <Route path="/admin/addsubject" element={<AddSubject />} />
          <Route path="/admin/allsubject" element={<GetSubject />} />
          <Route path="/admin/allstudent" element={<GetStudent />} />
          <Route path="/admin/addbranch" element={<AddBranch />} />
          <Route path="/admin/allbranch" element={<GetBranch />} />
          <Route path="/admin/addcourse" element={<AddCourse />} />
          <Route path="/admin/allcourse" element={<GetCourse />} />

          {/* Faculty  */}

          <Route path="/login/facultylogin" element={<FacultyLogin />} />
          <Route path="/faculty/home" element={<FacultyHome />} />
          <Route path="/faculty/password" element={<FacultyFirstTimePassword />} />
          <Route path="/faculty/profile" element={<FacultyProfile />} />
          <Route path="/faculty/update" element={<FacultyUpdate />} />
          <Route path="/faculty/update/password" element={<FacultyPassword />} />
          <Route path="/faculty/createtest" element={<CreateTest />} />
          <Route path="/faculty/uploadmarks" element={<UploadMarks />} />
          <Route path="/faculty/markattendance" element={<MarkAttendance />} />
          <Route path="/faculty/mysubjects" element={<MySubjects />} />
          <Route path="/faculty/mystudents" element={<MyStudents />} />

          {/* Student  */}

          <Route path="/login/studentlogin" element={<StudentLogin />} />
          <Route path="/student/home" element={<StudentHome />} />
          <Route path="/student/password" element={<StudentFirstTimePassword />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/update" element={<StudentUpdate />} />
          <Route path="/student/update/password" element={<StudentPassword />} />
          <Route path="/student/subjectlist" element={<SubjectList />} />
          <Route path="/student/testresult" element={<TestResult />} />
          <Route path="/student/attendance" element={<Attendance />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
