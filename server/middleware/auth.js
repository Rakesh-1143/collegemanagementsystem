import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { AUTH_COOKIE } from "../utils/auth.js";

const auth = (req, res, next) => {
  try {
    // Read the token from the httpOnly cookie first, then fall back to an
    // Authorization: Bearer header (useful for API clients / testing).
    const cookieToken = req.cookies?.[AUTH_COOKIE];
    const header = req.headers.authorization;
    let token = cookieToken;
    if (!token && header && header.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    const decodedData = jwt.verify(token, JWT_SECRET);
    req.userId = decodedData?.id;
    req.role = decodedData?.role;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.role || !roles.includes(req.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export default auth;