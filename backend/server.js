import express from "express";
import dotenv from "dotenv";

// routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import matchRoutes from "./routes/match.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // read req.body

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/messages", messageRoutes)

app.listen(PORT, console.log(`Listening on port ${PORT}`));