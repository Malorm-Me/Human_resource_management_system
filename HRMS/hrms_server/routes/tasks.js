import express from "express";
import {
  getTasksAssignedToUser,
  getTasksAssignedByManager,
  createTask,
  updateTaskStatus
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/assignedTo/:userId", getTasksAssignedToUser);
router.get("/assigned/:managerId", getTasksAssignedByManager);
router.post("/", createTask);
router.put("/updateStatus/:taskId", updateTaskStatus);

export default router;
