import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "USER";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left section: Back arrow + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="text-white text-2xl hover:text-gray-300 transition-colors"
        >
          ←
        </button>
        <span className="text-2xl">📊</span>
        <h1 className="text-xl font-bold">Stock Exchange</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Show role */}
        <span className="bg-blue-700 px-3 py-1 rounded text-sm font-medium">
          {role}
        </span>

        {/* Create Admin link for admins */}
        {role === "ADMIN" && (
          <Link
            to="/admin/register"
            className="bg-green-500 hover:bg-green-600 transition-colors px-4 py-1 rounded text-sm font-medium"
          >
            Create Admin
          </Link>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-1 rounded text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
