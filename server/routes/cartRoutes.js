import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js"; // Assuming you have a Product model
import User from "../models/User.js"; // Assuming you have a User model

const router = express.Router();

// 📌 Get User's Cart with Product Details
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ cart: { items: [] }, totalPrice: 0, points: 0 });
    }

    let totalPrice = 0;
    let detailedCartItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId); // Fetch product details
      if (product) {
        detailedCartItems.push({
          _id: item._id,
          productId: item.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
        });

        totalPrice += product.price * item.quantity;
      }
    }

    const user = await User.findById(userId);

    res.status(200).json({ cart: detailedCartItems, totalPrice, points: user.points });
  } catch (error) {
    console.error("❌ Fetch cart error:", error);
    res.status(500).json({ message: "Server error while fetching cart" });
  }
});

export default router;
