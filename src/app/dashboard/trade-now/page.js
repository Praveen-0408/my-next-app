"use client";

import { useState, useEffect, useCallback } from "react";

export default function TradeNow() {
  const [currencyPair, setCurrencyPair] = useState("FX:EURUSD");
  const [bidPrice, setBidPrice] = useState("Fetching...");
  const [askPrice, setAskPrice] = useState("Fetching...");
  const [tradeAmount, setTradeAmount] = useState("");
  const [orderType, setOrderType] = useState("market");

  useEffect(() => {
    const fetchPrices = () => {
      let bid = (1.1 + Math.random() * 0.02).toFixed(4);
      let ask = (parseFloat(bid) + 0.0002).toFixed(4);
      setBidPrice(bid);
      setAskPrice(ask);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [currencyPair]);

  // ✅ Fix: Use `useCallback` to prevent unnecessary re-renders
  const initializeTradingView = useCallback((symbol) => {
    if (window.TradingView) {
      new window.TradingView.widget({
        container_id: "tradingview_chart",
        width: "100%",
        height: "350",
        symbol: symbol,
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
    script.onload = () => initializeTradingView(currencyPair);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [currencyPair, initializeTradingView]);

  const executeTrade = (type) => {
    if (!tradeAmount) {
      alert("Enter trade amount!");
      return;
    }
    alert(`${type.toUpperCase()} Order Placed for ${tradeAmount} units of ${currencyPair}`);
  };

  return (
    <div className="trade-container">
      <h2>Trade Now</h2>

      <label>Select Currency Pair:</label>
      <select value={currencyPair} onChange={(e) => setCurrencyPair(e.target.value)}>
        <option value="FX:EURUSD">EUR/USD</option>
        <option value="FX:GBPUSD">GBP/USD</option>
        <option value="FX:USDJPY">USD/JPY</option>
        <option value="FX:USDCAD">USD/CAD</option>
        <option value="FX:AUDUSD">AUD/USD</option>
        <option value="FX:NZDUSD">NZD/USD</option>
        <option value="FX_IDC:USDINR">USD/INR</option>
        <option value="FX_IDC:EURINR">EUR/INR</option>
        <option value="FX_IDC:GBPINR">GBP/INR</option>
      </select>

      <div className="price-box">
        <p><strong>Bid Price:</strong> {bidPrice}</p>
        <p><strong>Ask Price:</strong> {askPrice}</p>
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
        <h3>Live Market Chart</h3>
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
