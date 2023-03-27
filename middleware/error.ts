import { Request, Response, NextFunction } from "express";
import { CustomError, CustomRequest } from "../interfaces/index.js";

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};

export default errorHandler;
