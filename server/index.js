import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import auth from "./middleware/auth.js";
import { addDummyAdmin } from "./controller/adminController.js";
import { addDummySuperAdmin } from "./controller/superAdminController.js";
import { getMe, logout } from "./controller/authController.js";
import { CLIENT_URL, IS_PRODUCTION } from "./config.js";

const app = express();
dotenv.config();

// Security headers (CSP etc.). Fine for a JSON API.
app.use(helmet());
// Allow the frontend origin(s) to send the httpOnly auth cookie.
const origins = CLIENT_URL.split(",").map((origin) => origin.trim());
app.use(
  cors({
    origin: origins.length === 1 ? origins[0] : origins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Trust the first proxy hop so secure cookies and rate limiting work when
// deployed behind a reverse proxy (e.g. Nginx, Heroku, Render).
app.set("trust proxy", 1);

app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/superadmin", superAdminRoutes);

// Restore / destroy the session (cookie based).
app.get("/api/me", auth, getMe);
app.post("/api/logout", logout);

const PORT = process.env.PORT || 5001;
app.get("/", (req, res) => {
  res.send("Hello to college erp API");
});

// API 404 + centralized error handler so every failure returns JSON.
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

mongoose
  .connect(process.env.CONNECTION_URL, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    // Always seed the SuperAdmin account (the function is idempotent –
    // it skips creation if the record already exists in MongoDB).
    await addDummySuperAdmin();

    if (!IS_PRODUCTION) {
      // Only seed dummy Admins in development / staging.
      await addDummyAdmin();
    } else {
      console.log(
        "Production mode: dummy Admin seeding skipped. Add admins via the Super Admin dashboard."
      );
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log("Mongo Error", error.message));