import express from "express";
import {
  login,
  register,
  resendOtp,
  verifyOtp,
  superAdminLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/superAdmin/login", superAdminLogin);

export default router;
