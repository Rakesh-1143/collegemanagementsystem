import Student from "../models/student.js";
import Test from "../models/test.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import bcrypt from "bcryptjs";
import {
  createAuthToken,
  sanitizeUser,
  setAuthCookie,
} from "../utils/auth.js";

export const studentLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ usernameError: "Username and password are required" });
    }
    const existingStudent = await Student.findOne({ username });
    if (!existingStudent) {
      return res.status(404).json({ usernameError: "Student doesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingStudent.password
    );
    if (!isPasswordCorrect) {
      return res.status(404).json({ passwordError: "Invalid Credentials" });
    }

    const token = createAuthToken(
      existingStudent._id,
      existingStudent.email,
      "student"
    );
    setAuthCookie(res, token);

    res.status(200).json({ result: sanitizeUser(existingStudent) });
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

    const student = await Student.findById(req.userId);
    if (!student) {
      return res.status(404).json({ backendError: "Student not found" });
    }
    student.password = await bcrypt.hash(newPassword, 10);
    student.passwordUpdated = true;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: sanitizeUser(student),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
    } = req.body;
    const student = await Student.findById(req.userId);
    if (!student) {
      return res.status(404).json({ backendError: "Student not found" });
    }
    if (name) student.name = name;
    if (dob) student.dob = dob;
    if (department) student.department = department;
    if (contactNumber) student.contactNumber = contactNumber;
    if (batch) student.batch = batch;
    if (section) student.section = section;
    if (year) student.year = year;
    if (motherName) student.motherName = motherName;
    if (fatherName) student.fatherName = fatherName;
    if (fatherContactNumber) student.fatherContactNumber = fatherContactNumber;
    if (avatar) student.avatar = avatar;
    await student.save();

    res.status(200).json(sanitizeUser(student));
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

// Returns the marks of the LOGGED-IN student (not the first student in the
// section, which is what the original implementation did).
export const testResult = async (req, res) => {
  try {
    const student = await Student.findById(req.userId);
    if (!student) {
      return res.status(404).json({ notestError: "Student not found" });
    }
    const test = await Test.find({
      department: student.department,
      year: student.year,
      section: student.section,
    });
    if (test.length === 0) {
      return res.status(404).json({ notestError: "No Test Found" });
    }
    const result = [];
    for (const t of test) {
      const subject = await Subject.findOne({ subjectCode: t.subjectCode });
      const marks = await Marks.findOne({
        student: student._id,
        exam: t._id,
      });
      if (marks && subject) {
        result.push({
          marks: marks.marks,
          totalMarks: t.totalMarks,
          subjectName: subject.subjectName,
          subjectCode: t.subjectCode,
          test: t.test,
        });
      }
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

// Returns the attendance of the LOGGED-IN student.
export const attendance = async (req, res) => {
  try {
    const student = await Student.findById(req.userId);
    if (!student) {
      return res.status(404).json({ notestError: "Student not found" });
    }
    const attendence = await Attendence.find({
      student: student._id,
    }).populate("subject");
    if (!attendence || attendence.length === 0) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.status(200).json({
      result: attendence
        .filter((att) => att.subject)
        .map((att) => ({
          percentage:
            att.totalLecturesByFaculty > 0
              ? ((att.lectureAttended / att.totalLecturesByFaculty) * 100).toFixed(2)
              : "0.00",
          subjectCode: att.subject.subjectCode,
          subjectName: att.subject.subjectName,
          attended: att.lectureAttended,
          total: att.totalLecturesByFaculty,
        })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};