import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";

dotenv.config();
const app = express();

app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend URL
    credentials: true, // Allow cookies & session sharing
  })
);

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey", // Use a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set `true` in production (HTTPS)
      httpOnly: true, // Prevents XSS attacks
      maxAge: 1000 * 60 * 60 * 24, // 24 hours session
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
