import { CustomError } from "../interfaces/index.js";
class ErrorResponse extends Error implements CustomError {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;
