import AppError from "../utils/appError.js";
import Student from "../models/studentModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import Admin from "../models/adminModel.js";

export const createStudent = catchAsync(async (req, res, next) => {
  const newStudent = await Student.create({
    ...req.body,
    adminId: req.admin._id,
  });

  res.status(201).json({
    status: "success",
    message: "Student successfully created",
    student: newStudent,
  });
});

export const getAllStudents = catchAsync(async (req, res, next) => {
  const students = await Student.find();

  res.status(200).json({
    status: "success",
    message: "All Students",
    students,
  });
});

export const getStudents = catchAsync(async (req, res, next) => {
  const students = await Student.find({ adminId: req.admin._id });

  res.status(200).json({
    status: "success",
    message: "All Students",
    students,
  });
});
