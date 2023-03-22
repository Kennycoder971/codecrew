import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    GET all data
 * @route   /api/foo
 */
export const getFoos = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ message: "foo message" });
});
