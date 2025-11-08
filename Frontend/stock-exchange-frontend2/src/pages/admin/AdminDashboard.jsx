import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import { getUsernameFromToken } from "../../utils/jwt";

export default function AdminDashboard() {
  const [exchanges, setExchanges] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = getUsernameFromToken() || "Admin";
  

  const loadData = async () => {
    setLoading(true);
    try {
      const [exRes, stRes] = await Promise.all([
        api.get("/exchanges/getAllExchanges"),
        api.get("/stocks/getAllStocks"),
      ]);
      setExchanges(exRes.data || []);
      setStocks(stRes.data || []);
    } catch (err) {
      console.error(err);
      setExchanges([]);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? date : d.toLocaleString();
  };

  const recentStocks = [...stocks].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Welcome {username}</h2>
      <p className="mb-6 text-gray-600">
        Here's a quick overview of exchanges and stocks.
      </p>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500">Exchanges</p>
              <p className="text-2xl font-bold">{exchanges.length}</p>
              <p className="text-gray-400 text-sm">Total exchanges managed</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500">Stocks</p>
              <p className="text-2xl font-bold">{stocks.length}</p>
              <p className="text-gray-400 text-sm">Total stocks listed</p>
            </div>
          </div>

          {/* Recent Stocks */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Recent Stocks
            </h3>
            {recentStocks.length === 0 ? (
              <p className="text-gray-500">No stocks have been added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStocks.map((s) => (
                      <tr key={s.id} className="border-t hover:bg-gray-50">
                        <td className="p-2">{s.id}</td>
                        <td className="p-2 font-medium">{s.name}</td>
                        <td className="p-2 text-gray-600">{s.description}</td>
                        <td className="p-2 font-semibold">${s.currentPrice}</td>
                        <td className="p-2">{formatDate(s.lastUpdate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-4 text-gray-500">
            Use the sidebar to manage stocks and exchanges.
          </p>
        </>
      )}
    </DashboardLayout>
  );
}
