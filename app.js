import cors from "cors";
import express from "express";
import morgan from "morgan";
import { globalErrorHandler } from "./controllers/errorController.js";

import authRoute from "./routes/authRoute.js";
import studentRoute from './routes/studentRoute.js'
import adminRoute from './routes/adminRoute.js'

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));

// ROUTES
app.use("/api", authRoute);
app.use("/api/admin", studentRoute);
app.use("/api", adminRoute);

// Error Handling Unhandled Routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
