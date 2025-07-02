import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import { swipeRight, swipeLeft, getMatches, getUserProfiles } from "../controllers/match.controller.js";

const router = express.Router();

router.post("/swipe-right/:likedUserId", protectRoute, swipeRight)
router.post("/swipe-left/:dislikedUserId", protectRoute, swipeLeft)

router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;