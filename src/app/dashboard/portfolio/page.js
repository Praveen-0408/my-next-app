"use client";

import { useState, useEffect } from "react";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([
    { id: 1, asset: "Gold (XAU/USD)", type: "Buy", entryPrice: 1805, quantity: 2 },
    { id: 2, asset: "Silver (XAG/USD)", type: "Sell", entryPrice: 22.50, quantity: 10 },
    { id: 3, asset: "EUR/USD", type: "Buy", entryPrice: 1.1050, quantity: 5000 },
  ]);
  const [livePrices, setLivePrices] = useState({});

  // ✅ Fetch live prices (Simulated, replace with real API)
  useEffect(() => {
    const fetchPrices = () => {
      const newPrices = {};
      portfolio.forEach((trade) => {
        if (trade.asset.includes("Gold")) {
          newPrices[trade.id] = (1800 + Math.random() * 10).toFixed(2);
        } else if (trade.asset.includes("Silver")) {
          newPrices[trade.id] = (22 + Math.random() * 0.5).toFixed(2);
        } else {
          newPrices[trade.id] = (1.10 + Math.random() * 0.01).toFixed(5);
        }
      });
      setLivePrices(newPrices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // Update prices every 5 seconds
    return () => clearInterval(interval);
  }, [portfolio]);

  // ✅ Calculate Profit/Loss (P&L)
  const calculatePL = (trade) => {
    const currentPrice = parseFloat(livePrices[trade.id]) || trade.entryPrice;
    const priceDifference = trade.type === "Buy"
      ? currentPrice - trade.entryPrice
      : trade.entryPrice - currentPrice;
    return (priceDifference * trade.quantity).toFixed(2);
  };

  // ✅ Close Trade (Remove from portfolio)
  const closeTrade = (id) => {
    setPortfolio(portfolio.filter((trade) => trade.id !== id));
  };

  return (
    <div className="portfolio-container">
      <h2>My Portfolio</h2>
      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>Entry Price</th>
            <th>Current Price</th>
            <th>Profit/Loss (P&L)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((trade) => (
            <tr key={trade.id}>
              <td>{trade.asset}</td>
              <td>{trade.type}</td>
              <td>{trade.entryPrice}</td>
              <td>{livePrices[trade.id] || "Fetching..."}</td>
              <td className={calculatePL(trade) >= 0 ? "profit" : "loss"}>
                {calculatePL(trade)} USD
              </td>
              <td>
                <button onClick={() => closeTrade(trade.id)}>Close</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .portfolio-container {
          max-width: 700px;
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
        .profit {
          color: green;
          font-weight: bold;
        }
        .loss {
          color: red;
          font-weight: bold;
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
