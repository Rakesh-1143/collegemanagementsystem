import SuperAdmin from "../models/superAdmin.js";
import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Branch from "../models/branch.js";
import Course from "../models/course.js";
import Subject from "../models/subject.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
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
};

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

const initialPasswordFromDob = (dob) => dob.split("-").reverse().join("-");

export const superAdminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ usernameError: "Username and password are required" });
    }
    const existingSuperAdmin = await SuperAdmin.findOne({ username });
    if (!existingSuperAdmin) {
      return res.status(404).json({ usernameError: "Super Admin doesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingSuperAdmin.password
    );
    if (!isPasswordCorrect) {
      return res.status(404).json({ passwordError: "Invalid Credentials" });
    }
    if (existingSuperAdmin.isActive === false) {
      return res
        .status(403)
        .json({ backendError: "Super Admin account is deactivated" });
    }

    const token = createAuthToken(existingSuperAdmin._id, existingSuperAdmin.email, "superadmin");
    setAuthCookie(res, token);

    res.status(200).json({ result: sanitizeUser(existingSuperAdmin) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateSuperAdminPassword = async (req, res) => {
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

    const superadmin = await SuperAdmin.findById(req.userId);
    if (!superadmin) {
      return res.status(404).json({ backendError: "Super Admin not found" });
    }
    superadmin.password = await bcrypt.hash(newPassword, 10);
    superadmin.passwordUpdated = true;
    await superadmin.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: sanitizeUser(superadmin),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateSuperAdminProfile = async (req, res) => {
  try {
    const { name, contactNumber, avatar } = req.body;
    const superadmin = await SuperAdmin.findById(req.userId);
    if (!superadmin) {
      return res.status(404).json({ backendError: "Super Admin not found" });
    }
    if (name) superadmin.name = name;
    if (contactNumber) superadmin.contactNumber = contactNumber;
    if (avatar) superadmin.avatar = avatar;
    await superadmin.save();

    res.status(200).json(sanitizeUser(superadmin));
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, joiningYear } =
      req.body;
    if (!name || !email || !dob) {
      return res
        .status(400)
        .json({ emailError: "Name, email, and DOB are required" });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ emailError: "Email already exists" });
    }

    let departmentCode = "UN";
    let adminCount = await Admin.countDocuments();
    
    if (department) {
      const existingDepartment = await Department.findOne({ department });
      if (!existingDepartment) {
        return res
          .status(400)
          .json({ departmentError: "Department does not exist" });
      }
      departmentCode = existingDepartment.departmentCode;
      const admins = await Admin.find({ department });
      adminCount = admins.length;
    }

    const username = buildUsername(
      USERNAME_BASE.admin,
      departmentCode,
      adminCount
    );
    const hashedPassword = await bcrypt.hash(initialPasswordFromDob(dob), 10);

    const newAdmin = await new Admin({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      avatar,
      contactNumber,
      dob,
      passwordUpdated: false,
      isActive: true,
    });
    await newAdmin.save();
    return res.status(200).json({
      success: true,
      message: "Admin registered successfully",
      response: sanitizeUser(newAdmin),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const { department } = req.body;
    const query = department ? { department } : {};
    const admins = await Admin.find(query).select("-password");
    // Return empty array (not 404) so the frontend can render the empty state
    // without the Redux action treating it as a network error.
    res.status(200).json({ result: admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ noAdminError: "No admins provided" });
    }
    for (const admin of req.body) {
      await Admin.findOneAndDelete({ _id: admin });
    }
    res.status(200).json({ message: "Admin Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateAdminStatus = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ backendError: "Admin not found" });
    }
    admin.isActive = isActive;
    await admin.save();
    res.status(200).json({ message: `Admin ${isActive ? "activated" : "deactivated"}`, response: sanitizeUser(admin) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const editAdmin = async (req, res) => {
  try {
    const { id, name, email, department, contactNumber } = req.body;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ backendError: "Admin not found" });
    }
    
    if (email && email !== admin.email) {
      const existingEmail = await Admin.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ emailError: "Email already exists" });
      }
      admin.email = email;
    }
    
    if (name) admin.name = name;
    if (department) admin.department = department;
    if (contactNumber) admin.contactNumber = contactNumber;
    
    await admin.save();
    res.status(200).json({ message: "Admin updated successfully", response: sanitizeUser(admin) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const addDummySuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = "Super Admin";
  const username = process.env.SUPER_ADMIN_USERNAME;

  // Never create a default / guessable Super Admin in production unless the
  // operator explicitly supplies all three credentials via environment
  // variables. This prevents a fresh deploy from shipping with
  // SUPERADMIN/123456 or superadmin@demo.com.
  let finalEmail = email;
  let finalPassword = password;
  let finalUsername = username;

  if (IS_PRODUCTION) {
    // Defense in depth - runs regardless of whether credentials are supplied:
    // if a Super Admin created with the old well-known default credentials
    // still exists AND still validates against the public default password
    // (123456), disable it and randomize the hash.
    const defaultAccount = await SuperAdmin.findOne({
      $or: [
        { email: "superadmin@demo.com" },
        { username: "SUPERADMIN" },
      ],
    });
    if (defaultAccount) {
      const stillDefault = await bcrypt.compare("123456", defaultAccount.password);
      if (stillDefault) {
        defaultAccount.isActive = false;
        defaultAccount.password = await bcrypt.hash(
          crypto.randomBytes(32).toString("hex"),
          10
        );
        await defaultAccount.save();
        console.error(
          "Production: the default Super Admin (SUPERADMIN / superadmin@demo.com) was still using the default password - account disabled and password randomized. Seed a new one via SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME and SUPER_ADMIN_PASSWORD."
        );
      }
    }

    if (!email || !password || !username) {
      console.log(
        "Production: skipping Super Admin seeding. Set SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME and SUPER_ADMIN_PASSWORD to create the first Super Admin."
      );
      return;
    }
    if (password.length < 8) {
      console.error(
        "FATAL: SUPER_ADMIN_PASSWORD must be at least 8 characters long."
      );
      return;
    }
  } else {
    finalEmail = email || "superadmin@demo.com";
    finalPassword = password || "123456";
    finalUsername = username || "SUPERADMIN";
  }

  const hashedPassword = await bcrypt.hash(finalPassword, 10);
  const existingSuperAdmin = await SuperAdmin.findOne({ email: finalEmail });

  if (!existingSuperAdmin) {
    await SuperAdmin.create({
      name,
      email: finalEmail,
      password: hashedPassword,
      username: finalUsername,
      passwordUpdated: true,
      isActive: true,
    });
    console.log(
      IS_PRODUCTION
        ? "Super admin seeded from environment variables."
        : "Dummy super admin added (development only)."
    );
  } else if (IS_PRODUCTION && existingSuperAdmin.isActive === false) {
    // Re-activate a previously disabled/rotated account when the operator now
    // supplies fresh credentials for it through the environment.
    existingSuperAdmin.name = name;
    existingSuperAdmin.email = finalEmail;
    existingSuperAdmin.password = hashedPassword;
    existingSuperAdmin.username = finalUsername;
    existingSuperAdmin.isActive = true;
    await existingSuperAdmin.save();
    console.log("Super admin re-activated with credentials from environment variables.");
  } else {
    console.log("Super admin already exists.");
  }
};

// --- Department Management (Super Admin only) ---

export const getUnassignedAdmins = async (req, res) => {
  try {
    const unassignedAdmins = await Admin.find({
      $or: [{ department: { $exists: false } }, { department: null }, { department: "" }],
    }).select("-password");
    res.status(200).json({ result: unassignedAdmins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const addDepartment = async (req, res) => {
  try {
    const { department, adminId } = req.body;
    if (!department || !adminId) {
      return res
        .status(400)
        .json({ departmentError: "Department name and assigned Admin are required" });
    }
    const existingDepartment = await Department.findOne({ department });
    if (existingDepartment) {
      return res.status(400).json({ departmentError: "Department already exists" });
    }

    const assignedAdmin = await Admin.findById(adminId);
    if (!assignedAdmin) {
      return res.status(400).json({ backendError: "Admin does not exist" });
    }
    if (assignedAdmin.department) {
      return res.status(400).json({ backendError: "Admin is already assigned to a department" });
    }

    // Compute the next free numeric code from the highest existing code so
    // that deleting a department can never collide with a later one (the
    // departmentCode field is unique).
    const departments = await Department.find({}).select("departmentCode");
    let maxCode = 0;
    departments.forEach((d) => {
      const n = parseInt(d.departmentCode, 10);
      if (!Number.isNaN(n) && n > maxCode) maxCode = n;
    });
    let departmentCode = (maxCode + 1).toString();
    if (departmentCode.length === 1) departmentCode = "0" + departmentCode;

    const newDepartment = await new Department({
      department,
      departmentCode,
      admin: assignedAdmin._id,
      isActive: true,
    });

    await newDepartment.save();

    assignedAdmin.department = department;
    await assignedAdmin.save();

    return res.status(200).json({
      success: true,
      message: "Department created successfully",
      response: newDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const editDepartment = async (req, res) => {
  try {
    const { id, department, adminId } = req.body;
    const existingDepartment = await Department.findById(id).populate("admin");
    if (!existingDepartment) {
      return res.status(404).json({ backendError: "Department not found" });
    }

    if (department && department !== existingDepartment.department) {
      const duplicate = await Department.findOne({ department });
      if (duplicate) {
        return res.status(400).json({ departmentError: "Department name already exists" });
      }
      existingDepartment.department = department;
    }

    if (adminId && existingDepartment.admin?._id.toString() !== adminId) {
      const newAdmin = await Admin.findById(adminId);
      if (!newAdmin) {
        return res.status(400).json({ backendError: "New Admin does not exist" });
      }
      if (newAdmin.department) {
        return res.status(400).json({ backendError: "New Admin is already assigned to another department" });
      }

      if (existingDepartment.admin) {
        const oldAdmin = await Admin.findById(existingDepartment.admin._id);
        if (oldAdmin) {
          oldAdmin.department = "";
          await oldAdmin.save();
        }
      }

      existingDepartment.admin = newAdmin._id;
      newAdmin.department = existingDepartment.department;
      await newAdmin.save();
    } else if (department && existingDepartment.admin) {
      const currentAdmin = await Admin.findById(existingDepartment.admin._id);
      if (currentAdmin) {
        currentAdmin.department = department;
        await currentAdmin.save();
      }
    }

    await existingDepartment.save();
    res.status(200).json({ message: "Department updated successfully", response: existingDepartment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.body;
    const existingDepartment = await Department.findById(id);
    if (!existingDepartment) {
      return res.status(404).json({ backendError: "Department not found" });
    }

    // Guard against orphaning live data: branches, courses, subjects, faculty
    // and students all hang off a department.
    const [branchCount, courseCount, subjectCount, facultyCount, studentCount] =
      await Promise.all([
        Branch.countDocuments({ department: id }),
        Course.countDocuments({ department: id }),
        Subject.countDocuments({ department: existingDepartment.department }),
        Faculty.countDocuments({ department: existingDepartment.department }),
        Student.countDocuments({ department: existingDepartment.department }),
      ]);
    if (
      branchCount + courseCount + subjectCount + facultyCount + studentCount > 0
    ) {
      return res.status(400).json({
        backendError:
          "Cannot delete a department that still has branches, courses, subjects, faculty or students. Deactivate it instead.",
      });
    }

    if (existingDepartment.admin) {
      const admin = await Admin.findById(existingDepartment.admin);
      if (admin) {
        admin.department = "";
        await admin.save();
      }
    }

    await Department.findByIdAndDelete(id);
    res.status(200).json({ message: "Department Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const updateDepartmentStatus = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ backendError: "Department not found" });
    }
    department.isActive = isActive;
    await department.save();
    res.status(200).json({ message: `Department ${isActive ? "activated" : "deactivated"}`, response: department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};

export const getAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find().populate("admin", "name email contactNumber username");
    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ backendError: "Something went wrong" });
  }
};
