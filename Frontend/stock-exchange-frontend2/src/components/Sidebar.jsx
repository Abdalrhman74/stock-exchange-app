import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaExchangeAlt, FaChartLine, FaBox } from "react-icons/fa";

export default function Sidebar() {
  const role = localStorage.getItem("role");
  const isAdmin = ["ADMIN", "ROLE_ADMIN"].includes(role);
  const location = useLocation();

  // Helper to check active link
  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = isAdmin
    ? [
        { name: "Manage Stocks", path: "/admin/stocks", icon: <FaBox /> },
        { name: "Manage Exchanges", path: "/admin/exchanges", icon: <FaExchangeAlt /> },
      ]
    : [
        { name: "View Stocks", path: "/user/stocks", icon: <FaBox /> },
        { name: "View Exchanges", path: "/user/exchanges", icon: <FaExchangeAlt /> },
      ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4 space-y-4 sticky top-0 h-screen">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-700">Menu</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-200 
              ${isActive(item.path) ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-800"}`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
