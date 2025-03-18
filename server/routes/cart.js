import express from "express";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

const router = express.Router();

// 📌 Add to Cart Route (Also Increase User Points)
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    // 📌 Increase user points by 2
    const user = await User.findById(userId);
    if (user) {
      user.points += 2;
      await user.save();
    }

    res.status(200).json({ message: "Product added to cart! 2 points awarded!", cart, points: user.points });
  } catch (error) {
    console.error("❌ Add to cart error:", error);
    res.status(500).json({ message: "Server error while adding to cart" });
  }
});

export default router;
