import express from "express";
const router = express.Router();

// get controller methods
import { getFoos } from "../controllers/foo.js";

router.route("/").get(getFoos);

export default router;
