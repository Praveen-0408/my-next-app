"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState("FX:EURUSD");
  const tradingViewLoaded = useRef(false); // Prevent multiple script loads

  // ✅ Function to Initialize TradingView Widget
  const initializeTradingView = (symbol) => {
    if (window.TradingView) {
      document.getElementById("tradingview_chart").innerHTML = ""; // Clear previous chart

      new window.TradingView.widget({
        container_id: "tradingview_chart",
        width: "100%",
        height: 500,
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
    } else {
      console.error("❌ TradingView script is not loaded!");
    }
  };

  // ✅ Load TradingView Script Only Once
  useEffect(() => {
    if (!tradingViewLoaded.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ TradingView script loaded.");
        initializeTradingView(selectedCurrency);
      };
      script.onerror = () => {
        console.error("❌ Failed to load TradingView script.");
      };
      document.body.appendChild(script);

      tradingViewLoaded.current = true; // Prevent multiple loads
    } else {
      initializeTradingView(selectedCurrency);
    }
  }, [selectedCurrency]); // Run when currency changes

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Rexo Trader</h2>
        <button onClick={() => router.push("/dashboard/trade-now")}>Trade Now</button>
        <button onClick={() => router.push("/dashboard/commodity-trading")}>Commodity Trading</button>
        <button onClick={() => router.push("/dashboard/watchlist")}>Watchlist</button>
        <button onClick={() => router.push("/dashboard/portfolio")}>Portfolio</button>
        <button onClick={() => router.push("/dashboard/deposit")}>Deposit Funds</button>
        <button onClick={() => router.push("/dashboard/withdraw")}>Withdraw Funds</button>
        <button onClick={() => router.push("/dashboard/accounts")}>My Account</button>
        <button onClick={() => router.push("/dashboard/settings")}>Settings</button>
      </div>

      {/* TradingView Widget */}
      <div className="tradingview-widget-container">
        <label htmlFor="currencySelector">Select Currency Pair:</label>
        <select
          id="currencySelector"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="FX:EURUSD">EUR/USD</option>
          <option value="FX:GBPUSD">GBP/USD</option>
          <option value="FX:USDJPY">USD/JPY</option>
          <option value="FX:USDCAD">USD/CAD</option>
          <option value="FX:AUDUSD">AUD/USD</option>
          <option value="FX:NZDUSD">NZD/USD</option>
          <option value="FX_IDC:USDINR">USD/INR</option>
          <option value="FX_IDC:EURINR">EUR/INR</option>
          <option value="FX_IDC:GBPINR">GBP/INR</option>
          <option value="FX_IDC:AUDINR">AUD/INR</option>
        </select>
        <div id="tradingview_chart"></div>
      </div>
    </div>
  );
};

export default Dashboard;
