import express from "express";
import { stat } from "../controllers/statController.js";

const router = express.Router();

router.get("/", stat);

export default router