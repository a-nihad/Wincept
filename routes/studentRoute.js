import express from "express";
import { protect, restictTo } from "../middlewares/authMiddleware.js";
import {
  createStudent,
  getAllStudents,
  getStudents,
} from "../controllers/StudentController.js";

const router = express.Router();

router.post("/createStudent", protect, createStudent);
// Admin can view students, only he created
router.get("/students", protect, getStudents);

// SuperAdmin can view all students with admin details
router.get("/allStudents", protect, restictTo("superAdmin"), getAllStudents);

export default router;
