import express from "express";
import cors from "cors";

import usersRoutes from "./routes/users.js";
import departmentsRoutes from "./routes/departments.js";
import authRoutes from "./routes/auth.js";
import resetPasswordRoute from "./routes/resetPassword.js";
import taskRoutes from "./routes/tasks.js";
import leaveRoutes from "./routes/leave.js";
import attendanceRoutes from "./routes/attendance.js";
import statRoutes from "./routes/stat.js";

const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/reset-password", resetPasswordRoute);
app.use("/api/assignTasks", taskRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/manager/stats", statRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
