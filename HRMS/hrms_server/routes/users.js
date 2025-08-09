import express from "express";
import {
  getAllUsers,
  getUsersList,
  getDepartmentMembers,
  addUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/all", getUsersList);
router.get("/department-members/:managerId", getDepartmentMembers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
