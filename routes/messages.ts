import express from "express";
const router = express.Router();

// get controller methods
import { getMessages } from "../controllers/messages.js";

router.route("/").get(getMessages);

export default router;
