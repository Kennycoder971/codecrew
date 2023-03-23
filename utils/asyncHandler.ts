import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
interface CustomRequest extends Request {
  user?: User;
}

const asyncHandler = function (
  callback: (req: CustomRequest, res: Response, next: NextFunction) => any
) {
  return function (req: CustomRequest, res: Response, next: NextFunction) {
    return callback(req, res, next).catch(next);
  };
};

export default asyncHandler;
