import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import bcrypt from "bcryptjs";
import {
  createAuthToken,
  sanitizeUser,
  setAuthCookie,
} from "../utils/auth.js";

export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ usernameError: "Username and password are required" });
    }
    const existingFaculty = await Faculty.findOne({ username });
    if (!existingFaculty) {
      return res.status(404).json({ usernameError: "Faculty doesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingFaculty.password
    );
    if (!isPasswordCorrect) {
      return res.status(404).json({ passwordError: "Invalid Credentials" });
    }

    const token = createAuthToken(
      existingFaculty._id,
      existingFaculty.email,
      "faculty"
    );
    setAuthCookie(res, token);

    res.status(200).json({ result: sanitizeUser(existingFaculty) });
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

    const faculty = await Faculty.findById(req.userId);
    if (!faculty) {
      return res.status(404).json({ backendError: "Faculty not found" });
    }
    faculty.password = await bcrypt.hash(newPassword, 10);
    faculty.passwordUpdated = true;
    await faculty.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: sanitizeUser(faculty),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { name, dob, contactNumber, avatar, designation } = req.body;
    const faculty = await Faculty.findById(req.userId);
    if (!faculty) {
      return res.status(404).json({ backendError: "Faculty not found" });
    }
    if (name) faculty.name = name;
    if (dob) faculty.dob = dob;
    // Faculty should NOT be able to change their department freely
    // if (department) faculty.department = department; 
    if (contactNumber) faculty.contactNumber = contactNumber;
    if (designation) faculty.designation = designation;
    if (avatar) faculty.avatar = avatar;
    await faculty.save();

    res.status(200).json(sanitizeUser(faculty));
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getMySubjects = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.userId).populate({
      path: "subject",
      populate: [
        { path: "branch", select: "branchName branchCode" },
        { path: "course", select: "courseName courseCode" }
      ]
    });
    if (!faculty) return res.status(404).json({ backendError: "Faculty not found" });

    if (!faculty.subject) {
      return res.status(200).json({ result: [] });
    }
    res.status(200).json({ result: [faculty.subject] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getMyStudents = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.userId);
    if (!faculty || !faculty.subject) {
      return res.status(404).json({ noStudentError: "No assigned subject found for faculty" });
    }

    const students = await Student.find({ subjects: faculty.subject })
      .select("-password")
      .populate("branch course");
      
    if (students.length === 0) {
      return res.status(404).json({ noStudentError: "No Student Found for your subject" });
    }
    res.status(200).json({ result: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

// Legacy fallback for some existing flows if needed, but overridden by getMyStudents
export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    // SECURITY PATCH: enforce that faculty can only see students in their subject
    const faculty = await Faculty.findById(req.userId);
    
    let query = { department, year, section };
    if (faculty && faculty.subject) {
      query.subjects = faculty.subject;
    }

    const students = await Student.find(query).select("-password");
    if (students.length === 0) {
      return res.status(404).json({ noStudentError: "No Student Found" });
    }
    res.status(200).json({ result: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const createTest = async (req, res) => {
  try {
    const { test, date, totalMarks } = req.body;
    
    if (!test || !date || !totalMarks) {
      return res.status(400).json({
        testError: "Test name, date, and total marks are required",
      });
    }

    const faculty = await Faculty.findById(req.userId).populate("subject");
    if (!faculty || !faculty.subject) {
       return res.status(403).json({ testError: "You are not assigned to any subject to create tests." });
    }
    
    const subjectCode = faculty.subject.subjectCode;
    const department = faculty.subject.department;
    const year = faculty.subject.year;
    // Note: older test schema required 'section'. We use a default 'A' if subject lacks it, or you could pass it.
    const section = req.body.section || "A";

    const existingTest = await Test.findOne({
      subjectCode,
      test,
      year,
    });
    if (existingTest) {
      return res.status(400).json({ testError: "Given Test is already created for this subject" });
    }

    const newTest = await new Test({
      totalMarks,
      section,
      test,
      date,
      department,
      subjectCode,
      year,
    });

    await newTest.save();
    return res.status(200).json({
      success: true,
      message: "Test added successfully",
      response: newTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getTest = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.userId).populate("subject");
    if (!faculty || !faculty.subject) {
       return res.status(200).json({ result: [] });
    }
    
    const tests = await Test.find({ 
      subjectCode: faculty.subject.subjectCode,
      year: faculty.subject.year 
    });
    res.status(200).json({ result: tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const uploadMarks = async (req, res) => {
  try {
    const { test, marks } = req.body;
    if (!Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ examError: "No marks provided" });
    }
    
    const faculty = await Faculty.findById(req.userId).populate("subject");
    if (!faculty || !faculty.subject) {
       return res.status(403).json({ examError: "Not authorized" });
    }

    const existingTest = await Test.findById(test);
    if (!existingTest) {
      return res.status(404).json({ examError: "Test not found." });
    }
    
    // Authorization check
    if (existingTest.subjectCode !== faculty.subject.subjectCode) {
      return res.status(403).json({ examError: "You can only upload marks for your assigned subjects." });
    }

    const isAlready = await Marks.find({ exam: existingTest._id });
    if (isAlready.length !== 0) {
      return res.status(400).json({ examError: "You have already uploaded marks of given exam" });
    }

    for (const mark of marks) {
      // Validation against total marks
      if (mark.value > existingTest.totalMarks || mark.value < 0) {
         continue; // Skip invalid marks or throw error
      }
      const newMarks = await new Marks({
        student: mark._id,
        exam: existingTest._id,
        marks: mark.value,
      });
      await newMarks.save();
    }
    res.status(200).json({ message: "Marks uploaded successfully" });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ examError: "Invalid marks payload" });
    }
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { selectedStudents, date } = req.body;
    if (!Array.isArray(selectedStudents)) {
      return res.status(400).json({ backendError: "No students selected" });
    }
    if (!date) {
      return res.status(400).json({ backendError: "Date is required" });
    }

    const faculty = await Faculty.findById(req.userId).populate("subject");
    if (!faculty || !faculty.subject) {
      return res.status(403).json({ backendError: "You are not assigned to any subject." });
    }
    
    const sub = faculty.subject;

    const allStudents = await Student.find({ subjects: sub._id });

    // Mark attendance
    for (const student of allStudents) {
      const isPresent = selectedStudents.includes(student._id.toString());
      
      let pre = await Attendence.findOne({
        student: student._id,
        subject: sub._id,
      });

      if (!pre) {
        pre = new Attendence({
          student: student._id,
          subject: sub._id,
        });
      }
      
      // Check for duplicate date
      const alreadyMarked = pre.history && pre.history.find(h => h.date === date);
      if (alreadyMarked) {
         // Skip, already marked for this date
         continue;
      }

      pre.totalLecturesByFaculty += 1;
      if (isPresent) {
        pre.lectureAttended += 1;
      }
      
      if (!pre.history) pre.history = [];
      pre.history.push({ date, present: isPresent });
      
      await pre.save();
    }

    res.status(200).json({ message: "Attendance Marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};