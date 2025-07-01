import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.get("/me", protectRoute, (req, res) => {
    res.send({
        user: req.user
    });
})

export default router;