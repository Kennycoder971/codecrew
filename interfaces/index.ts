import { Request, Response } from "express";
import { User } from "@prisma/client";

export interface CustomRequest extends Request {
  user?: User | null;
}
export interface CustomResponse extends Response {
  advancedResults?: [] | null;
}
export interface CustomError extends Error {
  statusCode: number;
}

export interface PaginationQueryObj {
  skip?: number;
  take?: number;
  select?: {};
  where?: {};
  orderBy?: {};
  include?: {};
}
