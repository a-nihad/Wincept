import Admin from "../models/adminModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find();

  res.status(200).json({
    status: "success",
    message: "All admins",
    admins,
  });
});
