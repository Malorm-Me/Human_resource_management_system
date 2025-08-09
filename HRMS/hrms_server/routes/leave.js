import express from "express";
import {
  submitLeaveRequest,
  getLeaveRequests,
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../controllers/leaveController.js";

const router = express.Router();
router.post("/", submitLeaveRequest);
router.get("/:userId", getLeaveRequests);
router.get("/", getAllLeaveRequests);
router.patch("/:id", updateLeaveStatus);

export default router;
