import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">ShoeLead</Link>
        </h1>
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-400 transition duration-300">
            Home
          </Link>
          <Link to="/cart" className="hover:text-blue-400 transition duration-300">
            Cart
          </Link>
          <Link to="/login" className="hover:text-blue-400 transition duration-300">
            Login
          </Link>
          <Link to="/signup" className="hover:text-blue-400 transition duration-300">
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
