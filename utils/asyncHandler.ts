import { Request, Response, NextFunction } from "express";

const asyncHandler = function (
  callback: (req: Request, res: Response, next: NextFunction) => any
) {
  return function (req: Request, res: Response, next: NextFunction) {
    return callback(req, res, next).catch(next);
  };
};

export default asyncHandler;
