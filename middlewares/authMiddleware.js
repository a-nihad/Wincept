import jwt from "jsonwebtoken";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import Admin from "../models/adminModel.js";

//! Protect routes
export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return next(
        new AppError("You are not logged in! please login to get access.", 400)
      );

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );

    // 3) Check if admin still exists
    const currentAdmin = await Admin.findById(decoded.id);
    if (!currentAdmin)
      return next(
        new AppError(
          "The admin beloging to this token does no longer exist.",
          400
        )
      );

    // Grant access to protected route
    req.admin = currentAdmin;

    next();
  } catch (err) {
    console.log(err);
  }
};

//! Restict routes
export const restictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role))
      return next(
        new AppError("You do not have permission to perform this action", 400)
      );

    next();
  };
};
