import jwt from "jsonwebtoken";
import { JWT_SECRET, IS_PRODUCTION } from "../config.js";

export const AUTH_COOKIE = "token";
export const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour, matches the JWT expiry

const cookieOptions = {
  httpOnly: true, // never readable from client-side JS
  sameSite: "lax",
  secure: IS_PRODUCTION, // only sent over HTTPS in production
  maxAge: TOKEN_TTL_MS,
  path: "/",
};

export const createAuthToken = (id, email, role) =>
  jwt.sign({ email, id, role }, JWT_SECRET, { expiresIn: "1h" });

export const setAuthCookie = (res, token) =>
  res.cookie(AUTH_COOKIE, token, cookieOptions);

export const clearAuthCookie = (res) =>
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PRODUCTION,
    path: "/",
  });

// Strip sensitive fields (password hash) before sending users to the client.
export const sanitizeUser = (doc) => {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete obj.password;
  return obj;
};