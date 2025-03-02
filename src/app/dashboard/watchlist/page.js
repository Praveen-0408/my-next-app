"use client";

import { useState, useEffect } from "react";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([
    { symbol: "FX:EURUSD", name: "EUR/USD" },
    { symbol: "FX:GBPUSD", name: "GBP/USD" },
    { symbol: "XAU/USD", name: "Gold" },
    { symbol: "XAG/USD", name: "Silver" },
  ]);
  const [prices, setPrices] = useState({});

  // ✅ Fetch prices for all assets in watchlist
  useEffect(() => {
    const fetchPrices = () => {
      const newPrices = {};
      watchlist.forEach((asset) => {
        newPrices[asset.symbol] = (1.10 + Math.random() * 0.01).toFixed(5); // Simulated price
      });
      setPrices(newPrices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [watchlist]);

  // ✅ Remove asset from watchlist
  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== symbol));
  };

  return (
    <div className="watchlist-container">
      <h2>My Watchlist</h2>
      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Live Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((asset) => (
            <tr key={asset.symbol}>
              <td>{asset.name}</td>
              <td>{prices[asset.symbol] || "Fetching..."}</td>
              <td>
                <button onClick={() => removeFromWatchlist(asset.symbol)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .watchlist-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border-radius: 10px;
          background: #f8f9fa;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h2 {
          color: #333;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: center;
        }
        th {
          background: #007bff;
          color: white;
        }
        button {
          background: #dc3545;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background: #c82333;
        }
      `}</style>
    </div>
  );
}
