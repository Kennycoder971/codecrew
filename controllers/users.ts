import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    GET messages
 * @route   /api/users
 */
export const getUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ users: res.advancedResults });
});
