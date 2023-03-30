import express from "express";
const router = express.Router();
import advancedResults from "../middleware/advancedResults.js";

// get controller methods
import { getUsers } from "../controllers/users.js";

router.route("/").get(advancedResults("user"), getUsers);

export default router;
