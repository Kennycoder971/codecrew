import asyncHandler from "../utils/asyncHandler";
import ErrorResponse from "../utils/errorResponse";
import prismadb from "../db/prismadb";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { sendTokenResponse } from "../utils/sendTokenResponse";

/**
 * @date      2022-06-22
 * @desc      Register user
 * @route     GET /api/auth/register
 * @access    Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;
  let user: User | null;

  // Check if name exists
  user = await prismadb.user.findFirst({
    where: {
      name: name,
    },
  });

  if (user) {
    return next(new ErrorResponse("This user already exists", 400));
  }
  // Check if email exists
  user = await prismadb.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    return next(new ErrorResponse("This email is already used", 400));
  }

  user = await prismadb.user.create({
    data: req.body,
  });

  sendTokenResponse(user, 201, res);
});

/**
 * @date      2022-06-22
 * @desc      Log user in
 * @route     POST /api/auth/login
 * @access    Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  let user: User | null;
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  user = await prismadb.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new ErrorResponse("Email or password incorrect", 401));
  }

  const isMatchPassword = await bcrypt.compare(password, user.hashedPassword);

  if (!isMatchPassword) {
    return next(new ErrorResponse("Email or password incorrect", 401));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @date      2022-06-22
 * @desc      Log user out / clear cookie
 * @route     GET /api/auth/logout
 * @access    Public
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @date      2022-06-22
 * @desc      Get current logged in user
 * @route     GET /api/auth/me
 * @access    Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});
