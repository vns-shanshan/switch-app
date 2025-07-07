import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import { sendMessage, getConversation } from "../controllers/message.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/send", sendMessage)
router.get("/conversation/:userId", getConversation)

export default router;