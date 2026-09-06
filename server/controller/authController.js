import Admin from "../models/admin.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import SuperAdmin from "../models/superAdmin.js";
import { clearAuthCookie, sanitizeUser } from "../utils/auth.js";

// Restore the logged-in user from the session cookie (called on app load).
export const getMe = async (req, res) => {
  try {
    let user = null;
    if (req.role === "admin") {
      user = await Admin.findById(req.userId).select("-password");
    } else if (req.role === "superadmin") {
      user = await SuperAdmin.findById(req.userId).select("-password");
    } else if (req.role === "faculty") {
      user = await Faculty.findById(req.userId).select("-password");
    } else if (req.role === "student") {
      user = await Student.findById(req.userId).select("-password");
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // A deactivated admin / super admin must lose their session immediately.
    if (
      (req.role === "admin" || req.role === "superadmin") &&
      user.isActive === false
    ) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Account deactivated" });
    }
    res.status(200).json({ role: req.role, result: sanitizeUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Invalidate the session cookie.
export const logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
};