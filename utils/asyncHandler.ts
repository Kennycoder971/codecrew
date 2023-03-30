import { CustomRequest, CustomResponse } from "../interfaces/index.js";
import { NextFunction } from "express";

const asyncHandler = function (
  callback: (req: CustomRequest, res: CustomResponse, next: NextFunction) => any
) {
  return function (req: CustomRequest, res: CustomResponse, next: NextFunction) {
    return callback(req, res, next).catch(next);
  };
};

export default asyncHandler;
