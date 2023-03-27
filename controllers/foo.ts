import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

/**
 * @desc    GET all data
 * @route   /api/foo
 */
export const getFoos = asyncHandler(async (req, res, next) => {
  try {
    if (req.query.foo === "bar") {
      throw new Error("Error message");
    }
  } catch (error) {
    return next(new ErrorResponse("My error message", 400));
  }
  return res.status(200).json({ message: "foo message" });
});
