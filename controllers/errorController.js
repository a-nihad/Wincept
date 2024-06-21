import AppError from "../utils/appError.js";

const sendError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programing Error or other unknown error
  } else {
    res.status(500).json({
      status: "error",
      message: "Somthing went vary wrong!",
    });
  }
};

//*********************************************

const handleDuplicateField = (err) => {
  const message = err.keyValue.email
    ? "This user already exists."
    : `Duplicate field value`;

  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");

  const message = `Invalid input data. ${errors}`;
  return new AppError(message, 400);
};

//*********************************************

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === 11000) err = handleDuplicateField(err);
  if (err.name === "ValidationError") err = handleValidationError(err);

  sendError(err, res);
};
