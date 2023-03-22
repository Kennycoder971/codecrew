import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    GET messages
 * @route   /api/messages
 */
export const getMessages = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ message: req.query.m });
});
