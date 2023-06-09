import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import prismadb from "../db/prismadb.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log(req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }

  if (!token) {
    return next(
      new ErrorResponse(
        "Vous n'êtes pas authorisés à accéder à cette route",
        401
      )
    );
  }

  try {
    let decoded;
    if (process.env.JWT_SECRET) {
      decoded = await jwt.verify(token, process.env.JWT_SECRET);
    }

    req.user = await prismadb.user.findFirst(decoded.id);

    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        "Vous n'êtes pas authorisés à accéder à cette route",
        401
      )
    );
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Un utilisateur avec le rôle :${req.user.role} ne peut pas accéder à cette route route`,
          403
        )
      );
    }
    next();
  };
};
