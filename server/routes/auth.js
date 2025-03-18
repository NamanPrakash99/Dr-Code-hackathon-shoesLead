import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 📌 Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user with initial points
    const user = new User({ name, email, password: hashedPassword, points: 10 });
    await user.save();

    res.status(201).json({ message: "User created successfully, 10 points awarded!" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// 📌 Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Add points for logging in
    user.points += 5; // 👈 Earn 5 points for logging in
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "7d", // Token expires in 7 days
    });

    res.status(200).json({
      message: "Login successful, 5 points awarded!",
      token,
      user: { id: user._id, name: user.name, email: user.email, points: user.points },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
