import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Response } from "express";

/**
 * @date 2022-06-22
 * @desc Get token from model, create cookie and send response
 */

export const sendTokenResponse = (
  user: User,
  statusCode: number,
  res: Response
) => {
  const token = getSignedJwtToken(user);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

export const getSignedJwtToken = (user: User) => {
  if (process.env.JWT_SECRET) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  }
};
