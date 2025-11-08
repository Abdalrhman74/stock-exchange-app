import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import "../../../src/index.css";
import { getUsernameFromToken } from "../../utils/jwt";


export default function UserDashboard() {
  const [totalExchanges, setTotalExchanges] = useState(0);
  const [totalStocks, setTotalStocks] = useState(0);
  const [recentStocks, setRecentStocks] = useState([]);
  const username = getUsernameFromToken() || "Admin";
  

  const loadSummary = async () => {
    try {
      const exchangesRes = await api.get("/exchanges/getAllExchanges");
      const stocksRes = await api.get("/stocks/getAllStocks");
      setTotalExchanges(exchangesRes.data?.length || 0);
      setTotalStocks(stocksRes.data?.length || 0);
      setRecentStocks(stocksRes.data?.slice(-5).reverse() || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? date : d.toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome {username}
          </h2>
          <p className="text-gray-600">
            Here's a quick overview of the stock market data you can explore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-700">Exchanges</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalExchanges}</p>
            <p className="text-gray-500 mt-1">Total exchanges available</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-700">Stocks</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{totalStocks}</p>
            <p className="text-gray-500 mt-1">Total stocks listed</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Stocks</h3>
          {recentStocks.length === 0 ? (
            <p className="text-gray-500">No stocks available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-gray-700">ID</th>
                    <th className="p-3 text-gray-700">Name</th>
                    <th className="p-3 text-gray-700">Description</th>
                    <th className="p-3 text-gray-700">Price</th>
                    <th className="p-3 text-gray-700">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStocks.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3">{s.id}</td>
                      <td className="p-3 font-medium text-gray-800">{s.name}</td>
                      <td className="p-3 text-gray-600">{s.description}</td>
                      <td className="p-3 font-semibold text-green-600">${s.currentPrice}</td>
                      <td className="p-3">{formatDate(s.lastUpdate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center text-gray-600 mt-4">
          Explore exchanges and stocks using the sidebar.
        </div>
      </div>
    </DashboardLayout>
  );
}
