import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function ExchangesPage({ isAdmin }) {
  const [exchanges, setExchanges] = useState([]);
  const [filteredExchanges, setFilteredExchanges] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [selectedExchangeForStocks, setSelectedExchangeForStocks] = useState(null);
  const [exchangeStocks, setExchangeStocks] = useState([]);
  const [newExchange, setNewExchange] = useState({ name: "", description: "", liveInMarket: false });
  const [stockIdInput, setStockIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadExchanges = async () => {
    try {
      const res = await api.get("/exchanges/getAllExchanges");
      setExchanges(res.data || []);
      setFilteredExchanges(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load exchanges");
    }
  };

  useEffect(() => {
    loadExchanges();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredExchanges(exchanges);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredExchanges(
        exchanges.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.id.toString().includes(q)
        )
      );
    }
    setCurrentPage(1); // reset to first page after search
  }, [searchQuery, exchanges]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExchanges = filteredExchanges.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExchanges.length / itemsPerPage);

  const createExchange = async () => {
    if (!newExchange.name.trim() || !newExchange.description.trim()) {
      alert("Please enter name and description");
      return;
    }
    try {
      await api.post("/exchanges/createExchange", newExchange);
      setNewExchange({ name: "", description: "", liveInMarket: false });
      setShowAddForm(false);
      loadExchanges();
    } catch (err) {
      console.error(err);
      alert("Failed to create exchange");
    }
  };

  const deleteExchange = async (id) => {
    if (!confirm("Delete this exchange?")) return;
    try {
      await api.delete(`/exchanges/deleteExchange/${id}`);
      if (selectedExchange?.id === id) setSelectedExchange(null);
      if (selectedExchangeForStocks?.id === id) {
        setSelectedExchangeForStocks(null);
        setExchangeStocks([]);
      }
      loadExchanges();
    } catch (err) {
      console.error(err);
      alert("Failed to delete exchange");
    }
  };

  const editExchange = async (exchangeId) => {
    if (selectedExchange?.id === exchangeId) {
      setSelectedExchange(null);
      return;
    }
    try {
      const res = await api.get(`/exchanges/getExchange/${exchangeId}`);
      setSelectedExchange(res.data);
      setSelectedExchangeForStocks(null); 
    } catch (err) {
      console.error(err);
      alert("Failed to load exchange details");
    }
  };

  const updateExchange = async () => {
    try {
      await api.patch(`/exchanges/updateExchange/${selectedExchange.id}`, selectedExchange);
      setSelectedExchange(null);
      loadExchanges();
    } catch (err) {
      console.error(err);
      alert("Failed to update exchange");
    }
  };

  const viewStocksForExchange = async (exchangeId) => {
    if (selectedExchangeForStocks?.id === exchangeId) {
      setSelectedExchangeForStocks(null);
      setExchangeStocks([]);
      return;
    }

    setLoading(true);
    setSelectedExchange(null); 

    try {
      const res = await api.get(`/exchanges/getExchange/${exchangeId}`);
      const exchangeDto = res.data;
      setSelectedExchangeForStocks(exchangeDto);

      const ids = Array.isArray(exchangeDto.stockIds)
        ? exchangeDto.stockIds
        : Array.from(exchangeDto.stockIds || []);

      if (!ids.length) {
        setExchangeStocks([]);
        setLoading(false);
        return;
      }

      const stockPromises = ids.map((id) =>
        api.get(`/stocks/getStock/${id}`).then((r) => r.data).catch(() => null)
      );
      const stocks = await Promise.all(stockPromises);
      setExchangeStocks(stocks.filter(Boolean));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stocks");
      setExchangeStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const addStock = async () => {
    if (!selectedExchangeForStocks?.id || !stockIdInput) {
      alert("Please select an exchange and enter a stock ID");
      return;
    }
    try {
      await api.post(`/exchanges/addStockToExchange/${selectedExchangeForStocks.id}/add-stock/${stockIdInput}`);
      setStockIdInput("");
      await viewStocksForExchange(selectedExchangeForStocks.id);
      await loadExchanges();
    } catch (err) {
      console.error(err);
      alert("Failed to add stock");
    }
  };

  const removeStock = async (stockId) => {
    try {
      await api.delete(`/exchanges/removeStockFromExchange/${selectedExchangeForStocks.id}/remove-stock/${stockId}`);
      await viewStocksForExchange(selectedExchangeForStocks.id);
      await loadExchanges();
    } catch (err) {
      console.error(err);
      alert("Failed to remove stock");
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
        <h3 className="text-2xl font-semibold text-gray-800">📈 Stock Exchanges</h3>
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
            {showAddForm ? "Close" : "+ New Exchange"}
          </button>
        )}
      </div>

      {/* Add Form */}
      {isAdmin && showAddForm && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-5 shadow-sm">
          <h4 className="font-semibold text-green-700 mb-3">🏦 Create New Exchange</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              placeholder="Exchange name"
              className="border p-2 rounded w-full"
              value={newExchange.name}
              onChange={(e) => setNewExchange({ ...newExchange, name: e.target.value })}
            />
            <input
              placeholder="Short description"
              className="border p-2 rounded w-full"
              value={newExchange.description}
              onChange={(e) => setNewExchange({ ...newExchange, description: e.target.value })}
            />
          </div>
          <button onClick={createExchange} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Create Exchange</button>
        </div>
      )}

      {/* Exchanges Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Live</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentExchanges.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{e.id}</td>
                <td className="p-3 font-medium">{e.name}</td>
                <td className="p-3 text-gray-600">{e.description}</td>
                <td className="p-3">{e.liveInMarket ? "✅" : "❌"}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  {isAdmin && (
                    <>
                      <button onClick={() => editExchange(e.id)} className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                      <button onClick={() => deleteExchange(e.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                    </>
                  )}
                  <button onClick={() => viewStocksForExchange(e.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">View Stocks</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExchanges.length === 0 && <div className="text-center py-4 text-gray-500">No exchanges found.</div>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

   


      {/* Edit Exchange Form */}
      {selectedExchange && (
        <div className="mt-6 bg-gray-50 border rounded-lg p-5 shadow-sm">
          <h4 className="text-lg font-semibold mb-3 text-blue-700">
            ✏️ Edit Exchange – {selectedExchange.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-700">Name</label>
              <input
                value={selectedExchange.name}
                onChange={(e) =>
                  setSelectedExchange({
                    ...selectedExchange,
                    name: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Description</label>
              <input
                value={selectedExchange.description}
                onChange={(e) =>
                  setSelectedExchange({
                    ...selectedExchange,
                    description: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
          <button
            onClick={updateExchange}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Stocks View */}
      {selectedExchangeForStocks && (
        <div className="mt-6 bg-gray-50 border rounded-lg p-5 shadow-sm">
          <h4 className="text-lg font-semibold mb-3 text-green-700">
            💹 Stocks in {selectedExchangeForStocks.name} ({exchangeStocks.length})
          </h4>

          {loading ? (
            <p>Loading...</p>
          ) : exchangeStocks.length === 0 ? (
            <p className="text-gray-600 text-sm">No stocks in this exchange.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Current Price</th>
                    <th className="p-3 text-left">Last Update</th>
                    {isAdmin && <th className="p-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {exchangeStocks.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{s.id}</td>
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3">{s.description}</td>
                      <td className="p-3">{s.currentPrice}</td>
                      <td className="p-3">{formatDate(s.lastUpdate)}</td>
                      {isAdmin && (
                        <td className="p-3">
                          <button
                            onClick={() => removeStock(s.id)}
                            className="text-red-600 underline hover:text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isAdmin && (
            <div className="flex gap-2 items-center mt-4">
              <input
                placeholder="Stock ID"
                value={stockIdInput}
                onChange={(e) => setStockIdInput(e.target.value)}
                className="border p-2 rounded w-32"
                type="number"
              />
              <button
                onClick={addStock}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Stock
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
