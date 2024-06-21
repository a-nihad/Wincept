import jwt from "jsonwebtoken";
import randomstring from "randomstring";

import Auth from "../models/authModel.js";
import Admin from "../models/adminModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendEmail } from "../utils/sendEmail.js";

//! Create JWT token‚
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//! Generate OTP
const generateOTP = async (email, userName) => {
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  // Send OTP to email
  sendEmail(email, userName, otp);

  const auth = await Auth.findOne({ email });

  if (auth) {
    await Auth.findByIdAndUpdate(auth._id, { otp }, { new: true });
  } else {
    await Auth.create({ email, otp });
  }
};

//! Register
export const register = catchAsync(async (req, res, next) => {
  const { userName, email, password } = req.body;

  const newAdmin = await Admin.create({
    userName,
    email,
    password,
  });

  generateOTP(email, userName);

  res.status(201).json({
    status: "success",
    message: "Sending email for OTP verification",
    admin: newAdmin,
  });
});

//! Log In
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password axist
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  // 2) Check if admin exists
  const admin = await Admin.findOne({ email });
  if (!admin)
    return next(new AppError("This admin does not exist, please sign up", 400));

  // 3) Check Password is correct
  if (!(await admin.checkPassword(password, admin.password)))
    return next(new AppError("Incorrect password", 401));

  // 4) check is admin
  if (admin.role !== "admin")
    return next(new AppError("Please login superAdmin login page", 400));

  // 5) Check verify status. If false then resend OTP to mail
  if (admin.isVerified === false) {
    generateOTP(email, admin.userName);

    res.status(200).json({
      status: "pending",
      message:
        "Pending Email verification, Please check your email for OTP verification",
      admin,
    });
  }

  const token = createToken(admin._id);

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    token,
    admin,
  });
});

//! Verify OTP
export const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  const auth = await Auth.findOne({ email });

  if (!auth) return next(new AppError("Time out, Try resend OTP", 400));

  if (auth.otp !== otp) return next(new AppError("Invalid Otp", 400));

  const admin = await Admin.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  );
  const token = createToken(admin._id);

  res.status(200).json({
    status: "success",
    message: "Token verification is successfully",
    token,
    admin,
  });
});

//! Resend OTP
export const resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return next(new AppError("No admin found ", 400));

  generateOTP(email, admin.userName);

  res.status(200).json({
    status: "success",
    message: "Please check your email",
    admin,
  });
});

//! Log In Super Admin
export const superAdminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const superAdmin = await Admin.findOne({ email });
  if (!superAdmin)
    return next(
      new AppError("This Admin does not exist, please register", 400)
    );

  if (!(await superAdmin.checkPassword(password, superAdmin.password)))
    return next(new AppError("Incorrect email or password", 401));

  if (superAdmin.role !== "superAdmin")
    return next(new AppError("Only access superAdmin only", 400));

  if (superAdmin.isVerified === false) {
    generateOTP(email, superAdmin.userName);

    res.status(200).json({
      status: "pending",
      message:
        "Pending Email verification, Please check your email for OTP verification",
      superAdmin,
    });
  }

  const token = createToken(superAdmin._id);

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    token,
    superAdmin,
  });
});
