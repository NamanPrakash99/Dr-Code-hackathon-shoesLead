import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const products = [
  { id: "1", name: "Nike Air Max", price: 120, image: "/images/shoe1.jpg" },
  { id: "2", name: "Adidas Ultraboost", price: 150, image: "/images/shoe2.jpg" },
  { id: "3", name: "Puma Running", price: 100, image: "/images/shoe3.jpg" },
];

function Home() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [points, setPoints] = useState(0);

  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user

  useEffect(() => {
    if (user) {
      setPoints(user.points);
    }
  }, []);

  const addToCart = async (product) => {
    if (!user) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: 1,
      });

      setCart(res.data.cart.items);
      setPoints(res.data.points); // Update points UI
      user.points = res.data.points;
      localStorage.setItem("user", JSON.stringify(user)); // Update local storage
      alert(`${product.name} added to cart! You earned 2 points!`);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700">Welcome to ShoeLead</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-700">🏆 Points: {points}</span>
          <button
            onClick={() => navigate("/cart")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            🛒 Cart ({cart.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full max-w-5xl">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
