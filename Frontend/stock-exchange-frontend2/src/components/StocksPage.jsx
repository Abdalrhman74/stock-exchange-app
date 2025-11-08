import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function StocksPage({ isAdmin }) {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStock, setNewStock] = useState({
    name: "",
    description: "",
    currentPrice: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadStocks = async () => {
    try {
      const res = await api.get("/stocks/getAllStocks");
      setStocks(res.data || []);
      setFilteredStocks(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load stocks");
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStocks(stocks);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredStocks(
        stocks.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.id.toString().includes(q)
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, stocks]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = filteredStocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

  const createStock = async () => {
    if (!newStock.name || !newStock.description || !newStock.currentPrice) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await api.post("/stocks/createStock", newStock);
      setNewStock({ name: "", description: "", currentPrice: "" });
      setShowAddForm(false);
      loadStocks();
    } catch (err) {
      console.error(err);
      alert("Failed to create stock");
    }
  };

  const deleteStock = async (id) => {
    if (!confirm("Delete this stock?")) return;
    try {
      await api.delete(`/stocks/deleteStock/${id}`);
      if (selectedStock?.id === id) setSelectedStock(null);
      loadStocks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete stock");
    }
  };

  const editStock = (stock) => {
    if (selectedStock?.id === stock.id) setSelectedStock(null);
    else setSelectedStock(stock);
  };

  const updateStockPrice = async () => {
    if (!selectedStock.currentPrice) {
      alert("Please enter a price");
      return;
    }
    try {
      await api.patch(`/stocks/updateStock/${selectedStock.id}`, {
        currentPrice: selectedStock.currentPrice,
      });
      setSelectedStock(null);
      loadStocks();
    } catch (err) {
      console.error(err);
      alert("Failed to update stock price");
    }
  };

  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return isNaN(date) ? d : date.toLocaleString();
  };

  return (
    <div className="section bg-white p-6 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">💹 Stocks</h3>
        <input
          type="text"
          placeholder="🔍 Search by name or ID..."
          className="border border-gray-300 p-2 rounded-lg w-full md:w-64 focus:ring focus:ring-blue-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isAdmin && (
          <button
            onClick={() => setShowAddForm((p) => !p)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            {showAddForm ? "Close" : "+ New Stock"}
          </button>
        )}
      </div>

      {/* Add Form */}
      {isAdmin && showAddForm && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-5 shadow-sm">
          <h4 className="font-semibold text-green-700 mb-3">➕ Add New Stock</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              placeholder="Stock name"
              className="border p-2 rounded w-full"
              value={newStock.name}
              onChange={(e) =>
                setNewStock({ ...newStock, name: e.target.value })
              }
            />
            <input
              placeholder="Short description"
              className="border p-2 rounded w-full"
              value={newStock.description}
              onChange={(e) =>
                setNewStock({ ...newStock, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Current Price"
              className="border p-2 rounded w-full"
              value={newStock.currentPrice}
              onChange={(e) =>
                setNewStock({ ...newStock, currentPrice: e.target.value })
              }
            />
          </div>
          <button
            onClick={createStock}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Stock
          </button>
        </div>
      )}

      {/* Stocks Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Current Price</th>
              <th className="p-3">Last Update</th>
              {isAdmin && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentStocks.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.id}</td>
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3 text-gray-600">{s.description}</td>
                <td className="p-3 font-semibold">${s.currentPrice}</td>
                <td className="p-3">{formatDate(s.lastUpdate)}</td>
                {isAdmin && (
                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => editStock(s)}
                      className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      {selectedStock?.id === s.id ? "Close" : "Edit"}
                    </button>
                    <button
                      onClick={() => deleteStock(s.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStocks.length === 0 && (
          <div className="text-center py-4 text-gray-500">No stocks found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Edit Stock Price Form */}
      {selectedStock && (
        <div className="mt-6 bg-gray-50 border rounded-lg p-5 shadow-sm">
          <h4 className="text-lg font-semibold mb-3 text-blue-700">
            ✏️ Edit Stock – {selectedStock.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="number"
              value={selectedStock.currentPrice}
              onChange={(e) =>
                setSelectedStock({
                  ...selectedStock,
                  currentPrice: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            onClick={updateStockPrice}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
