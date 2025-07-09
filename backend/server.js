import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";

import { connectDB } from "./config/db.js";
import { initializeSocket } from "./socket/socket.server.js";

// routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import matchRoutes from "./routes/match.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

initializeSocket(httpServer)

app.use(express.json()); // read req.body
app.use(cookieParser()); // read req.cookies
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/messages", messageRoutes)

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
});