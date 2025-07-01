import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export default async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "You are not authorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "You are not authorized - Invalid token" });
        }

        const currentUser = await User.findById(decoded.id);

        req.user = currentUser;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error);

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "You are not authorized - Invalid token" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}