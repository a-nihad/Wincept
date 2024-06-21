import express from "express";
import { protect, restictTo } from "../middlewares/authMiddleware.js";
import { getAllAdmins } from "../controllers/adminController.js";

const router = express.Router();

// superAdmin can view all Admins
router.get("/admins", protect, restictTo("superAdmin"), getAllAdmins);

export default router;
