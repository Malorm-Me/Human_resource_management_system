import express from "express";
import {
  clockIn,
  clockOut,
  getAttendanceHistory,
  getTodayStatus,
  getAllAttendance
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut); 
router.get("/:user_id", getAttendanceHistory);
router.get("/status/:user_id", getTodayStatus);
router.get("/", getAllAttendance);

export default router;
