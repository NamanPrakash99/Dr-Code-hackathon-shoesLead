import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: String,
  items: [{ productId: String, quantity: Number }],
});

export default mongoose.model("Cart", CartSchema);
