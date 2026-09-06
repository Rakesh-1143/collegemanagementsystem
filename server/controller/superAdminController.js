import SuperAdmin from "../models/superAdmin.js";
import Admin from "../models/admin.js";
import Department from "../models/department.js";
import bcrypt from "bcryptjs";
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
    if (admins.length === 0) {
      return res.status(404).json({ noAdminError: "No Admin Found" });
    }
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
  const email = process.env.SUPER_ADMIN_EMAIL || "superadmin@demo.com";
  const password = process.env.SUPER_ADMIN_PASSWORD || "123456";
  const name = "Super Admin";
  const username = process.env.SUPER_ADMIN_USERNAME || "SUPERADMIN";

  const hashedPassword = await bcrypt.hash(password, 10);

  const dummySuperAdmin = await SuperAdmin.findOne({ email });

  if (!dummySuperAdmin) {
    await SuperAdmin.create({
      name,
      email,
      password: hashedPassword,
      username,
      passwordUpdated: true,
      isActive: true,
    });
    console.log("Dummy super admin added.");
  } else {
    console.log("Dummy super admin already exists.");
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

    const departments = await Department.find({});
    let departmentCode = (departments.length + 1).toString();
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
