import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Notice from "../models/notice.js";
import Branch from "../models/branch.js";
import Course from "../models/course.js";
import Attendance from "../models/attendance.js";
import Marks from "../models/marks.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { IS_PRODUCTION } from "../config.js";
import {
  createAuthToken,
  sanitizeUser,
  setAuthCookie,
} from "../utils/auth.js";

const USERNAME_BASE = {
  admin: "ADM",
  faculty: "FAC",
  student: "STU",
};

// Generates usernames like ADM2024<deptCode><seq>.
const buildUsername = (prefix, departmentCode, count) => {
  let helper;
  if (count < 10) {
    helper = "00" + count.toString();
  } else if (count < 100) {
    helper = "0" + count.toString();
  } else {
    helper = count.toString();
  }
  return [prefix, new Date().getFullYear(), departmentCode, helper].join("");
};

// The date the user is created with (YYYY-MM-DD from the date input) is
// reversed to DD-MM-YYYY and used as the initial password.
const initialPasswordFromDob = (dob) => dob.split("-").reverse().join("-");

// --- Helper for Admin Scoping ---
const getAdminDepartmentId = async (req) => {
  const admin = await Admin.findById(req.userId);
  if (!admin) return null;
  const department = await Department.findOne({ department: admin.department });
  return department ? department._id : null;
};

// The department NAME the logged-in admin belongs to (or null if unassigned).
const getAdminDepartmentName = async (req) => {
  const admin = await Admin.findById(req.userId);
  return admin && admin.department ? admin.department : null;
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ usernameError: "Username and password are required" });
    }
    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin) {
      return res.status(404).json({ usernameError: "Admin doesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!isPasswordCorrect) {
      return res.status(404).json({ passwordError: "Invalid Credentials" });
    }
    if (existingAdmin.isActive === false) {
      return res.status(403).json({
        backendError: "Your account has been deactivated. Contact the Super Admin.",
      });
    }

    const token = createAuthToken(existingAdmin._id, existingAdmin.email, "admin");
    setAuthCookie(res, token);

    res.status(200).json({ result: sanitizeUser(existingAdmin) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        mismatchError: "Your password and confirmation password do not match",
      });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        passwordError: "Password must be at least 6 characters long",
      });
    }

    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ backendError: "Admin not found" });
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.passwordUpdated = true;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: sanitizeUser(admin),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar } = req.body;
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ backendError: "Admin not found" });
    }
    if (name) admin.name = name;
    if (dob) admin.dob = dob;
    if (department) admin.department = department;
    if (contactNumber) admin.contactNumber = contactNumber;
    if (avatar) admin.avatar = avatar;
    await admin.save();

    res.status(200).json(sanitizeUser(admin));
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};


export const addDummyAdmin = async () => {
  const email = "dummy@gmail.com";
  const password = "123";
  const name = "dummy";
  const username = "ADMDUMMY";

  const existing = await Admin.findOne({ email });

  // Production: never create the dev account, and if a dummy admin was seeded
  // earlier (development mode) disable it and randomize its password so the
  // well-known ADMDUMMY/123 credentials can no longer be used to log in.
  if (IS_PRODUCTION) {
    if (existing) {
      if (existing.isActive !== false) {
        existing.isActive = false;
        existing.password = await bcrypt.hash(
          crypto.randomBytes(32).toString("hex"),
          10
        );
        await existing.save();
        console.log(
          "Production: development dummy admin found - account disabled and password randomized."
        );
      }
    } else {
      console.log("Production: dummy admin not created.");
    }
    return;
  }

  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      name,
      email,
      password: hashedPassword,
      username,
      passwordUpdated: true,
      isActive: true,
    });
    console.log("Dummy user added (development only).");
  } else {
    console.log("Dummy user already exists.");
  }
};

export const createNotice = async (req, res) => {
  try {
    const { from, content, topic, date, noticeFor } = req.body;
    if (!from || !content || !topic || !date || !noticeFor) {
      return res.status(400).json({
        noticeError: "Topic, content, date, from and noticeFor are required",
      });
    }
    const existingNotice = await Notice.findOne({ topic, content, date });
    if (existingNotice) {
      return res.status(400).json({ noticeError: "Notice already created" });
    }
    const newNotice = await new Notice({
      from,
      content,
      topic,
      noticeFor,
      date,
    });
    await newNotice.save();
    return res.status(200).json({
      success: true,
      message: "Notice created successfully",
      response: newNotice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};



export const addFaculty = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      branch,
      course,
      subject,
      contactNumber,
      avatar,
      email,
      joiningYear,
      gender,
      designation,
    } = req.body;
    if (!name || !email || !dob || !department || !branch || !course || !subject || !designation) {
      return res.status(400).json({
        emailError:
          "All academic assignment fields (Department, Branch, Course, Subject) and personal details are required",
      });
    }
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ emailError: "Email already exists" });
    }
    const existingDepartment = await Department.findOne({ department });
    if (!existingDepartment) {
      return res
        .status(400)
        .json({ departmentError: "Department does not exist" });
    }
    const adminDepartmentId = await getAdminDepartmentId(req);
    if (adminDepartmentId && existingDepartment._id.toString() !== adminDepartmentId.toString()) {
        return res.status(403).json({ backendError: "Unauthorized to add faculty to this department" });
    }

    const existingBranch = await Branch.findOne({ _id: branch, department: existingDepartment._id });
    if (!existingBranch) return res.status(400).json({ backendError: "Invalid Branch for this Department" });

    const existingCourse = await Course.findOne({ _id: course, branch });
    if (!existingCourse) return res.status(400).json({ backendError: "Invalid Course for this Branch" });

    const existingSubject = await Subject.findOne({ _id: subject, course });
    if (!existingSubject) return res.status(400).json({ backendError: "Invalid Subject for this Course" });

    const faculties = await Faculty.find({ department });
    const username = buildUsername(
      USERNAME_BASE.faculty,
      existingDepartment.departmentCode,
      faculties.length
    );
    const hashedPassword = await bcrypt.hash(initialPasswordFromDob(dob), 10);

    const newFaculty = await new Faculty({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      branch,
      course,
      subject,
      avatar,
      contactNumber,
      dob,
      gender,
      designation,
      passwordUpdated: false,
    });
    await newFaculty.save();
    return res.status(200).json({
      success: true,
      message: "Faculty registered successfully",
      response: sanitizeUser(newFaculty),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getFaculty = async (req, res) => {
  try {
    const { department, search, page = 1, limit = 1000 } = req.body;
    const query = department ? { department } : {};

    // A department-level admin may only ever read faculty from their own
    // department, regardless of what the request body asks for.
    const adminDepartmentName = await getAdminDepartmentName(req);
    if (adminDepartmentName) {
      if (department && department !== adminDepartmentName) {
        return res
          .status(403)
          .json({ backendError: "Unauthorized to view faculty outside your department" });
      }
      query.department = adminDepartmentName;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Faculty.countDocuments(query);
    const faculties = await Faculty.find(query)
      .populate("branch course subject")
      .select("-password")
      .skip(skip)
      .limit(limit)
      .lean();

    if (faculties.length === 0 && page === 1) {
      return res.status(200).json({
        result: [],
        totalPages: 1,
        currentPage: 1,
        totalRecords: 0,
      });
    }
    res.status(200).json({ result: faculties, totalPages: Math.ceil(total / limit), currentPage: page, totalRecords: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getNotice = async (req, res) => {
  try {
    const notices = await Notice.find({});
    res.status(200).json({ result: notices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const addSubject = async (req, res) => {
  try {
    const { totalLectures, department, branch, course, subjectCode, subjectName, year } =
      req.body;
    if (!department || !branch || !course || !subjectCode || !subjectName || !year) {
      return res.status(400).json({
        subjectError:
          "All fields including branch and course are required",
      });
    }
    const subject = await Subject.findOne({ subjectCode });
    if (subject) {
      return res.status(400).json({
        subjectError: "Given Subject is already added",
      });
    }

    const departmentObj = await Department.findOne({ department });
    if (!departmentObj) return res.status(400).json({ backendError: "Department does not exist" });
    const adminDepartmentId = await getAdminDepartmentId(req);
    if (adminDepartmentId && departmentObj._id.toString() !== adminDepartmentId.toString()) {
        return res.status(403).json({ backendError: "Unauthorized to add subject to this department" });
    }

    const existingBranch = await Branch.findOne({ _id: branch, department: departmentObj._id });
    if (!existingBranch) return res.status(400).json({ backendError: "Invalid Branch for this Department" });

    const existingCourse = await Course.findOne({ _id: course, branch });
    if (!existingCourse) return res.status(400).json({ backendError: "Invalid Course for this Branch" });

    const newSubject = await new Subject({
      totalLectures,
      department,
      branch,
      course,
      subjectCode,
      subjectName,
      year,
    });

    await newSubject.save();
    // Enroll only students of the matching branch/course so subjects never
    // leak across academic programs. Legacy subjects without branch/course
    // keep enrolling everyone in the department/year.
    const pushFilter = { department, year };
    if (existingBranch && existingCourse) {
      pushFilter.branch = existingBranch._id;
      pushFilter.course = existingCourse._id;
    }
    await Student.updateMany(
      pushFilter,
      { $addToSet: { subjects: newSubject._id } }
    );
    return res.status(200).json({
      success: true,
      message: "Subject added successfully",
      response: newSubject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getSubject = async (req, res) => {
  try {
    // Students see exactly the subjects they are enrolled in (their own
    // branch/course), never every subject in a department/year.
    if (req.role === "student") {
      const student = await Student.findById(req.userId);
      if (!student) {
        return res.status(404).json({ noSubjectError: "Student not found" });
      }
      const enrolled = await Subject.find({
        _id: { $in: student.subjects || [] },
      })
        .populate("branch course")
        .lean();
      return res.status(200).json({
        result: enrolled,
        totalPages: 1,
        currentPage: 1,
        totalRecords: enrolled.length,
      });
    }

    const { department, year, branch, course, search, page = 1, limit = 1000 } = req.body;

    const adminDepartmentId = await getAdminDepartmentId(req);
    let effectiveDepartment = department;
    if (adminDepartmentId) {
      if (department) {
        const requestedDept = await Department.findOne({ department });
        if (!requestedDept || requestedDept._id.toString() !== adminDepartmentId.toString()) {
          return res.status(403).json({ backendError: "Unauthorized to view subjects for this department" });
        }
      } else {
        // Admin must always search inside their own department.
        const admin = await Admin.findById(req.userId);
        effectiveDepartment = admin?.department;
      }
    }

    const query = { department: effectiveDepartment, year };
    if (branch) query.branch = branch;
    if (course) query.course = course;

    if (search) {
      query.$or = [
        { subjectName: { $regex: search, $options: "i" } },
        { subjectCode: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Subject.countDocuments(query);
    const subjects = await Subject.find(query)
      .populate("branch course")
      .skip(skip)
      .limit(limit)
      .lean();

    if (subjects.length === 0 && page === 1) {
      return res.status(200).json({
        result: [],
        totalPages: 1,
        currentPage: 1,
        totalRecords: 0,
      });
    }
    res.status(200).json({ result: subjects, totalPages: Math.ceil(total / limit), currentPage: page, totalRecords: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { _id, subjectName, subjectCode, totalLectures, isActive, branch, course } = req.body;
    const adminDepartmentId = await getAdminDepartmentId(req);
    if (!adminDepartmentId) return res.status(400).json({ backendError: "Admin department not found" });

    const subject = await Subject.findById(_id);
    if (!subject) return res.status(404).json({ backendError: "Subject not found" });
    
    const subjectDept = await Department.findOne({ department: subject.department });
    if (!subjectDept || subjectDept._id.toString() !== adminDepartmentId.toString()) {
        return res.status(403).json({ backendError: "Unauthorized to update subject in this department" });
    }

    if (subjectName) subject.subjectName = subjectName;
    if (subjectCode) subject.subjectCode = subjectCode;
    if (totalLectures) subject.totalLectures = totalLectures;
    if (isActive !== undefined) subject.isActive = isActive;
    
    if (branch) {
      const existingBranch = await Branch.findOne({ _id: branch, department: adminDepartmentId });
      if (!existingBranch) return res.status(400).json({ backendError: "Invalid Branch" });
      subject.branch = branch;
    }
    if (course) {
      const existingCourse = await Course.findOne({ _id: course, branch: subject.branch });
      if (!existingCourse) return res.status(400).json({ backendError: "Invalid Course" });
      subject.course = course;
    }

    await subject.save();
    res.status(200).json({ message: "Subject updated successfully", response: subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};


export const deleteFaculty = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ noFacultyError: "No faculties provided" });
    }
    const adminDepartmentId = await getAdminDepartmentId(req);
    for (const facultyId of req.body) {
      const faculty = await Faculty.findById(facultyId);
      if (faculty) {
        const dept = await Department.findOne({ department: faculty.department });
        if (adminDepartmentId && dept && dept._id.toString() !== adminDepartmentId.toString()) {
          return res.status(403).json({ backendError: "Unauthorized" });
        }
        await Faculty.findOneAndDelete({ _id: facultyId });
      }
    }
    res.status(200).json({ message: "Faculty Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ noStudentError: "No students provided" });
    }
    const adminDepartmentId = await getAdminDepartmentId(req);
    for (const studentId of req.body) {
      const student = await Student.findById(studentId);
      if (student) {
        const dept = await Department.findOne({ department: student.department });
        if (adminDepartmentId && dept && dept._id.toString() !== adminDepartmentId.toString()) {
          return res.status(403).json({ backendError: "Unauthorized" });
        }
        // Cascade: remove attendance + marks records so no orphan rows remain.
        await Attendance.deleteMany({ student: studentId });
        await Marks.deleteMany({ student: studentId });
        await Student.findOneAndDelete({ _id: studentId });
      }
    }
    res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ noSubjectError: "No subjects provided" });
    }
    const adminDepartmentId = await getAdminDepartmentId(req);
    for (const subjectId of req.body) {
      const subject = await Subject.findById(subjectId);
      if (subject) {
        const dept = await Department.findOne({ department: subject.department });
        if (adminDepartmentId && dept && dept._id.toString() !== adminDepartmentId.toString()) {
          return res.status(403).json({ backendError: "Unauthorized" });
        }
        // Cascade: drop the subject from students' lists and delete attendance
        // records for it so no orphan references remain.
        await Student.updateMany(
          { subjects: subjectId },
          { $pull: { subjects: subjectId } }
        );
        await Attendance.deleteMany({ subject: subjectId });
        await Subject.findOneAndDelete({ _id: subjectId });
      }
    }
    res.status(200).json({ message: "Subject Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};



export const addStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      section,
      gender,
      batch,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      year,
      branch,
      course,
    } = req.body;
    if (!name || !email || !dob || !department || !section || !year || !branch || !course) {
      return res.status(400).json({
        emailError: "Name, email, DOB, department, branch, course, section and year are required",
      });
    }
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ emailError: "Email already exists" });
    }
    const existingDepartment = await Department.findOne({ department });
    if (!existingDepartment) {
      return res
        .status(400)
        .json({ departmentError: "Department does not exist" });
    }
    const adminDepartmentId = await getAdminDepartmentId(req);
    if (adminDepartmentId && existingDepartment._id.toString() !== adminDepartmentId.toString()) {
        return res.status(403).json({ backendError: "Unauthorized to add student to this department" });
    }

    const existingBranch = await Branch.findOne({ _id: branch, department: existingDepartment._id });
    if (!existingBranch) return res.status(400).json({ backendError: "Invalid Branch for this Department" });

    const existingCourse = await Course.findOne({ _id: course, branch });
    if (!existingCourse) return res.status(400).json({ backendError: "Invalid Course for this Branch" });

    const students = await Student.find({ department });
    const username = buildUsername(
      USERNAME_BASE.student,
      existingDepartment.departmentCode,
      students.length
    );
    const hashedPassword = await bcrypt.hash(initialPasswordFromDob(dob), 10);

    // Enroll only subjects that belong to the student's own branch/course
    // (plus legacy subjects that were created without a branch/course).
    const subjectQuery = { department, year };
    if (branch && course) {
      subjectQuery.$or = [
        { branch, course },
        { branch: { $exists: false }, course: { $exists: false } },
      ];
    }
    const subjects = await Subject.find(subjectQuery, "_id");
    const subjectIds = subjects.map(s => s._id);

    const newStudent = await new Student({
      name,
      dob,
      password: hashedPassword,
      username,
      department,
      contactNumber,
      avatar,
      email,
      section,
      gender,
      batch,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      year,
      branch,
      course,
      subjects: subjectIds,
      passwordUpdated: false,
    });
    await newStudent.save();

    return res.status(200).json({
      success: true,
      message: "Student registered successfully",
      response: sanitizeUser(newStudent),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { department, year, search, page = 1, limit = 1000 } = req.body;
    const query = { department, year };

    // A department-level admin may only read students from their own department.
    const adminDepartmentName = await getAdminDepartmentName(req);
    if (adminDepartmentName) {
      if (department && department !== adminDepartmentName) {
        return res
          .status(403)
          .json({ backendError: "Unauthorized to view students outside your department" });
      }
      query.department = adminDepartmentName;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .lean();

    if (students.length === 0 && page === 1) {
      return res.status(200).json({
        result: [],
        totalPages: 1,
        currentPage: 1,
        totalRecords: 0,
      });
    }

    res.status(200).json({ result: students, totalPages: Math.ceil(total / limit), currentPage: page, totalRecords: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getAllDepartment = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ backendError: "Admin not found" });
    const department = await Department.findOne({ department: admin.department });
    res.status(200).json(department ? [department] : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find().select("-password");
    res.status(200).json(faculties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getAllSubject = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

// --- Helper for Branch & Course ---


// --- Branch Management ---
export const addBranch = async (req, res) => {
  try {
    const { branchName, branchCode, description, status } = req.body;
    if (!branchName) {
      return res.status(400).json({ branchError: "Branch name is required" });
    }
    const departmentId = await getAdminDepartmentId(req);
    if (!departmentId) {
      return res.status(400).json({ backendError: "Admin department not found" });
    }

    const existingBranch = await Branch.findOne({ branchName, department: departmentId });
    if (existingBranch) {
      return res.status(400).json({ branchError: "Branch already exists in this department" });
    }

    const newBranch = new Branch({
      branchName,
      branchCode,
      description,
      department: departmentId,
      isActive: status !== undefined ? status : true,
    });
    await newBranch.save();

    res.status(200).json({ success: true, message: "Branch created successfully", response: newBranch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getBranches = async (req, res) => {
  try {
    const departmentId = await getAdminDepartmentId(req);
    if (!departmentId) {
      return res.status(400).json({ backendError: "Admin department not found" });
    }
    const branches = await Branch.find({ department: departmentId }).populate("department");
    res.status(200).json({ result: branches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { _id } = req.body;
    const departmentId = await getAdminDepartmentId(req);
    if (!departmentId) return res.status(400).json({ backendError: "Admin department not found" });

    const branch = await Branch.findOne({ _id, department: departmentId });
    if (!branch) return res.status(404).json({ backendError: "Branch not found or unauthorized" });

    const courses = await Course.find({ branch: _id });
    if (courses.length > 0) {
      return res.status(400).json({ backendError: "Cannot delete branch with existing courses. Deactivate it instead." });
    }

    await Branch.findByIdAndDelete(_id);
    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateBranch = async (req, res) => {
    try {
        const { _id, branchName, branchCode, description, isActive } = req.body;
        const departmentId = await getAdminDepartmentId(req);
        if (!departmentId) return res.status(400).json({ backendError: "Admin department not found" });

        const branch = await Branch.findOne({ _id, department: departmentId });
        if (!branch) return res.status(404).json({ backendError: "Branch not found or unauthorized" });

        if (branchName && branchName !== branch.branchName) {
            const existing = await Branch.findOne({ branchName, department: departmentId });
            if (existing) return res.status(400).json({ branchError: "Branch name already exists" });
            branch.branchName = branchName;
        }
        if (branchCode !== undefined) branch.branchCode = branchCode;
        if (description !== undefined) branch.description = description;
        if (isActive !== undefined) branch.isActive = isActive;
        
        await branch.save();
        res.status(200).json({ message: "Branch updated successfully", response: branch });
    } catch(err) {
        console.error(err);
        res.status(500).json({ backendError: "Something went wrong" });
    }
};

// --- Course Management ---
export const addCourse = async (req, res) => {
  try {
    const { courseName, courseCode, branchId, courseType, duration, status } = req.body;
    if (!courseName || !branchId) {
      return res.status(400).json({ courseError: "Course name and branch are required" });
    }
    const departmentId = await getAdminDepartmentId(req);
    if (!departmentId) {
      return res.status(400).json({ backendError: "Admin department not found" });
    }

    const branch = await Branch.findOne({ _id: branchId, department: departmentId });
    if (!branch) {
      return res.status(400).json({ backendError: "Branch not found or unauthorized" });
    }

    const existingCourse = await Course.findOne({ courseName, branch: branchId });
    if (existingCourse) {
      return res.status(400).json({ courseError: "Course already exists in this branch" });
    }

    const newCourse = new Course({
      courseName,
      courseCode,
      branch: branchId,
      department: departmentId,
      courseType,
      duration,
      isActive: status !== undefined ? status : true,
    });
    await newCourse.save();

    res.status(200).json({ success: true, message: "Course created successfully", response: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const departmentId = await getAdminDepartmentId(req);
    if (!departmentId) {
      return res.status(400).json({ backendError: "Admin department not found" });
    }
    const courses = await Course.find({ department: departmentId }).populate("branch department");
    res.status(200).json({ result: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { _id } = req.body;
    const departmentId = await getAdminDepartmentId(req);
    if (!departmentId) return res.status(400).json({ backendError: "Admin department not found" });

    const course = await Course.findOne({ _id, department: departmentId });
    if (!course) return res.status(404).json({ backendError: "Course not found or unauthorized" });

    const subjects = await Subject.find({ course: _id });
    if (subjects.length > 0) {
      return res.status(400).json({ backendError: "Cannot delete course with existing subjects. Deactivate it instead." });
    }

    await Course.findByIdAndDelete(_id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateCourse = async (req, res) => {
    try {
        const { _id, courseName, courseCode, courseType, duration, isActive } = req.body;
        const departmentId = await getAdminDepartmentId(req);
        if (!departmentId) return res.status(400).json({ backendError: "Admin department not found" });

        const course = await Course.findOne({ _id, department: departmentId });
        if (!course) return res.status(404).json({ backendError: "Course not found or unauthorized" });

        if (courseName && courseName !== course.courseName) {
            const existing = await Course.findOne({ courseName, branch: course.branch });
            if (existing) return res.status(400).json({ courseError: "Course name already exists in this branch" });
            course.courseName = courseName;
        }
        if (courseCode !== undefined) course.courseCode = courseCode;
        if (courseType !== undefined) course.courseType = courseType;
        if (duration !== undefined) course.duration = duration;
        if (isActive !== undefined) course.isActive = isActive;
        
        await course.save();
        res.status(200).json({ message: "Course updated successfully", response: course });
    } catch(err) {
        console.error(err);
        res.status(500).json({ backendError: "Something went wrong" });
    }
};

export const getSubjectsByCourse = async (req, res) => {
  try {
    const { course } = req.body;
    if (!course) return res.status(400).json({ backendError: "Course is required" });
    const subjects = await Subject.find({ course });
    res.status(200).json({ result: subjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const editFaculty = async (req, res) => {
  try {
    const { _id, branch, course, subject, designation, contactNumber } = req.body;
    const departmentId = await getAdminDepartmentId(req);
    if (!departmentId) return res.status(400).json({ backendError: "Admin department not found" });

    const faculty = await Faculty.findById(_id);
    if (!faculty) return res.status(404).json({ backendError: "Faculty not found" });

    if (branch) {
      const existingBranch = await Branch.findOne({ _id: branch, department: departmentId });
      if (!existingBranch) return res.status(400).json({ backendError: "Invalid Branch" });
      faculty.branch = branch;
    }
    if (course) {
      const existingCourse = await Course.findOne({ _id: course, branch: faculty.branch });
      if (!existingCourse) return res.status(400).json({ backendError: "Invalid Course" });
      faculty.course = course;
    }
    if (subject) {
      const existingSubject = await Subject.findOne({ _id: subject, course: faculty.course });
      if (!existingSubject) return res.status(400).json({ backendError: "Invalid Subject" });
      faculty.subject = subject;
    }
    if (designation) faculty.designation = designation;
    if (contactNumber) faculty.contactNumber = contactNumber;

    await faculty.save();
    res.status(200).json({ message: "Faculty updated successfully", response: faculty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};