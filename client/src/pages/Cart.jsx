import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [points, setPoints] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
      setCart(res.data.cart);
      setTotal(res.data.totalPrice);
      setPoints(res.data.points);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/cart/remove", {
        userId: user.id,
        productId,
      });

      setCart(res.data.cart);
      setTotal(res.data.totalPrice);
      setPoints(res.data.points);

      user.points = res.data.points;
      localStorage.setItem("user", JSON.stringify(user));
      alert("Item removed from cart!");
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">🛒 Your Cart</h1>

      <div className="w-full max-w-4xl bg-white p-6 shadow-md rounded-lg">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.productId} className="flex justify-between items-center border-b py-3">
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Price: ${item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))
        )}

        <div className="mt-4 text-lg font-semibold">
          Total: <span className="text-blue-500">${total}</span>
        </div>
        <div className="mt-2 text-lg">
          🏆 Points: <span className="text-green-500">{points}</span>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Cart;
