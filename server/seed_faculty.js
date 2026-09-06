import mongoose from "mongoose";
import Faculty from "./models/faculty.js";
import Student from "./models/student.js";
import Subject from "./models/subject.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Create a subject
    let subject = await Subject.findOne({ subjectCode: "TEST101" });
    if (!subject) {
      subject = new Subject({
        subjectName: "Testing Engineering",
        subjectCode: "TEST101",
        department: "Computer Science",
        year: "1",
      });
      await subject.save();
      console.log("Created subject:", subject.subjectName);
    }

    // Create a faculty
    let faculty = await Faculty.findOne({ username: "FAC123" });
    if (!faculty) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      faculty = new Faculty({
        name: "John Doe",
        email: "john@example.com",
        username: "FAC123",
        password: hashedPassword,
        department: "Computer Science",
        subject: subject._id,
        dob: "1980-01-01",
        passwordUpdated: true,
        joiningYear: 2020,
        designation: "Professor",
      });
      await faculty.save();
      console.log("Created faculty:", faculty.username);
    } else {
      faculty.subject = subject._id;
      faculty.passwordUpdated = true;
      faculty.password = await bcrypt.hash("password123", 10);
      await faculty.save();
    }

    // Create a student assigned to the subject
    let student = await Student.findOne({ username: "STU123" });
    if (!student) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      student = new Student({
        name: "Jane Smith",
        email: "jane@example.com",
        username: "STU123",
        password: hashedPassword,
        department: "Computer Science",
        year: 1,
        section: "A",
        dob: "2000-01-01",
        subjects: [subject._id],
        batch: "2024-2028",
        gender: "Female"
      });
      await student.save();
      console.log("Created student:", student.username);
    } else {
      student.subjects = [subject._id];
      await student.save();
    }

    console.log("----------------------");
    console.log("FACULTY LOGIN: ");
    console.log("Username: FAC123");
    console.log("Password: password123");
    console.log("----------------------");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

run();
