import jwt from "jsonwebtoken";

import User from "../models/User.model.js";

const signToken = (id) => {
    // jwt token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
}

export const signup = async (req, res) => {
    const { name, email, password, age, gender, genderPreference } = req.body;

    try {
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            age,
            gender,
            genderPreference
        })

        const token = signToken(newUser._id)

        res.cookie("jwt", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
            httpOnly: true, // prevents XSS attacks
            sameSite: "strict", // prevents CSRF attacks
            secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS
        })

        res.status(201).json({ user: newUser });
    } catch (error) {
        console.log("Error in signup controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = signToken(user._id);

        res.cookie("jwt", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
            httpOnly: true, // prevents XSS attacks
            sameSite: "strict", // prevents CSRF attacks
            secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS
        });

        res.status(200).json({ user });
    } catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    res.clearCookies("jwt");
    res.status(200).json({ message: "Logged out successfully" });
}