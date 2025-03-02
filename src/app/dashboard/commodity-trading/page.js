"use client";

import { useState, useEffect, useCallback } from "react";

export default function CommodityTrading() {
  const [commodity, setCommodity] = useState("GOLD_FUTURE");
  const [bidPrice, setBidPrice] = useState("Fetching...");
  const [askPrice, setAskPrice] = useState("Fetching...");
  const [tradeAmount, setTradeAmount] = useState("");
  const [orderType, setOrderType] = useState("market");

  useEffect(() => {
    const fetchPrices = () => {
      let bid;
      switch (commodity) {
        case "GOLD_FUTURE":
          bid = (1900 + Math.random() * 50).toFixed(2);
          break;
        case "GOLD_SPOT":
          bid = (1850 + Math.random() * 50).toFixed(2);
          break;
        case "SILVER":
          bid = (22 + Math.random() * 2).toFixed(2);
          break;
        case "COPPER":
          bid = (4 + Math.random() * 0.5).toFixed(2);
          break;
        case "ZINC":
          bid = (2.5 + Math.random() * 0.2).toFixed(2);
          break;
        case "ALUMINIUM":
          bid = (1.5 + Math.random() * 0.2).toFixed(2);
          break;
        case "BRONZE":
          bid = (5 + Math.random() * 0.5).toFixed(2);
          break;
        default:
          bid = "N/A";
      }
      const ask = (bid * 1.002).toFixed(2);
      setBidPrice(bid);
      setAskPrice(ask);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [commodity]);

  // ✅ Fix: Use `useCallback` to prevent unnecessary re-renders
  const initializeTradingView = useCallback((symbol) => {
    if (window.TradingView) {
      new window.TradingView.widget({
        container_id: "tradingview_chart",
        width: "100%",
        height: "350",
        symbol: getTradingViewSymbol(symbol),
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
      });
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => initializeTradingView(commodity);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [commodity, initializeTradingView]); // ✅ Now includes `initializeTradingView`

  const getTradingViewSymbol = (commodity) => {
    const mapping = {
      GOLD_FUTURE: "COMEX:GC1!",
      GOLD_SPOT: "OANDA:XAUUSD",
      SILVER: "OANDA:XAGUSD",
      COPPER: "COMEX:HG1!",
      ZINC: "LME:ZNC1!",
      ALUMINIUM: "LME:ALI1!",
      BRONZE: "LME:BRN1!", // Example, may need real ticker
    };
    return mapping[commodity] || "OANDA:XAUUSD";
  };

  const executeTrade = (type) => {
    if (!tradeAmount) {
      alert("Enter trade amount!");
      return;
    }
    alert(`${type.toUpperCase()} Order Placed for ${tradeAmount} units of ${commodity}`);
  };

  return (
    <div className="trade-container">
      <h2>Commodity Trading</h2>

      <label>Select Commodity:</label>
      <select value={commodity} onChange={(e) => setCommodity(e.target.value)}>
        <option value="GOLD_FUTURE">Future Gold</option>
        <option value="GOLD_SPOT">Spot Gold</option>
        <option value="SILVER">Silver</option>
        <option value="COPPER">Copper</option>
        <option value="ZINC">Zinc</option>
        <option value="ALUMINIUM">Aluminium</option>
        <option value="BRONZE">Bronze</option>
      </select>

      <div className="price-box">
        <p><strong>Bid Price:</strong> {bidPrice} USD</p>
        <p><strong>Ask Price:</strong> {askPrice} USD</p>
      </div>

      <label>Order Type:</label>
      <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
        <option value="market">Market Order</option>
        <option value="limit">Limit Order</option>
      </select>

      <label>Trade Amount:</label>
      <input
        type="number"
        value={tradeAmount}
        onChange={(e) => setTradeAmount(e.target.value)}
        placeholder="Enter trade amount"
      />

      <div className="trade-buttons">
        <button className="buy" onClick={() => executeTrade("buy")}>Buy</button>
        <button className="sell" onClick={() => executeTrade("sell")}>Sell</button>
      </div>

      <div className="tradingview-container">
        <h3>Commodity Market Chart</h3>
        <div id="tradingview_chart"></div>
      </div>

      <style jsx>{`
        .trade-container {
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
        }
        label {
          display: block;
          margin-top: 10px;
          font-weight: bold;
        }
        select, input {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .price-box {
          background: #e9ecef;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }
        .trade-buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
        }
        .buy {
          background-color: #28a745;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .sell {
          background-color: #dc3545;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .buy:hover {
          background-color: #218838;
        }
        .sell:hover {
          background-color: #c82333;
        }
        .tradingview-container {
          margin-top: 20px;
          background: #fff;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        h3 {
          color: #333;
          margin-bottom: 10px;
        }
        #tradingview_chart {
          width: 100%;
          height: 350px;
        }
      `}</style>
    </div>
  );
}
