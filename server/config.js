import dotenv from "dotenv";

dotenv.config();

// JWT_SECRET is required. Do not ship a fallback secret to production.
if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL: JWT_SECRET is missing. Add it to server/.env (see server/.env.example)."
  );
  process.exit(1);
}

export const JWT_SECRET = process.env.JWT_SECRET;

// Comma-separated list of allowed browser origins (CORS).
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export const NODE_ENV = process.env.NODE_ENV || "development";

export const IS_PRODUCTION = NODE_ENV === "production";

// Number of login attempts allowed per IP per window.
export const LOGIN_RATE_LIMIT = Number(process.env.LOGIN_RATE_LIMIT) || 50;
export const LOGIN_RATE_WINDOW_MS =
  (Number(process.env.LOGIN_RATE_WINDOW_MINUTES) || 15) * 60 * 1000;