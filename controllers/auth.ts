import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import prismadb from "../db/prismadb.js";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { sendTokenResponse } from "../utils/sendTokenResponse.js";
import { userValidationSchema } from "../validations/index.js";

/**
 * @date      2022-06-22
 * @desc      Register user
 * @route     GET /api/auth/register
 * @access    Public
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = await userValidationSchema.validateAsync(
    req.body
  );

  let user: User | null;

  // Check if name exists
  user = await prismadb.user.findFirst({
    where: { name: name },
  });

  if (user) {
    return next(new ErrorResponse("This user already exists", 400));
  }
  // Check if email exists
  user = await prismadb.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return next(new ErrorResponse("This email is already used", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await prismadb.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  sendTokenResponse(user, 201, res);
});

/**
 * @date      2022-06-22
 * @desc      Log user in
 * @route     POST /api/auth/login
 * @access    Public
 */
export const login = asyncHandler(async (req, res, next) => {
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
export const logout = asyncHandler(async (req, res, next) => {
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
export const getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update User Password
 * @route   PUT /api/auth/updatePassword
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res, next) => {
  // password ops
  const { oldPassword, newPassword } = req.body;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

  // check password input
  if (!newPassword || !oldPassword) {
    return next(
      new ErrorResponse(
        "New Password and Old Password fields are required",
        400
      )
    );
  }

  // check password validity
  if (regex.test(newPassword) === false) {
    return next(
      new ErrorResponse(
        "Please enter a valid new password, at least one lowercase and uppercase letter and one number",
        400
      )
    );
  }

  // check if password matches with one in db
  const user = await prismadb.user.findFirst({
    where: {
      id: req.user.id,
    },
  });
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);

  // if match
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // change password
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  // save
  const updatedUser = await prismadb.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      hashedPassword: newHashedPassword,
    },
  });

  // generate JWT
  sendTokenResponse(updatedUser, 200, res);
});
