import rateLimit from "express-rate-limit";
import { LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS } from "../config.js";

// Throttle login attempts per IP to slow down brute-force attacks.
export const loginLimiter = rateLimit({
  windowMs: LOGIN_RATE_WINDOW_MS,
  limit: LOGIN_RATE_LIMIT,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many login attempts from this IP. Please try again later.",
  },
});