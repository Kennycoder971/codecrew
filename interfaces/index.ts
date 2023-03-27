import { Request } from "express";
import { User } from "@prisma/client";

export interface CustomRequest extends Request {
  user?: User | null;
}

export interface CustomError extends Error {
  statusCode: number;
}
