import { CustomRequest } from "../interfaces/index.js";
import { Response, NextFunction } from "express";

const asyncHandler = function (
  callback: (req: CustomRequest, res: Response, next: NextFunction) => any
) {
  return function (req: CustomRequest, res: Response, next: NextFunction) {
    return callback(req, res, next).catch(next);
  };
};

export default asyncHandler;
