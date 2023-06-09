import express from "express";
const router = express.Router();

// get controller methods
import {
  register,
  login,
  logout,
  getMe,
  updatePassword,
} from "../controllers/auth.js";

import { protect } from "../middleware/auth.js";

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/me").get(protect, getMe);

router.route("/logout").get(logout);

router.route("/updatePassword").post(protect, updatePassword);

export default router;
