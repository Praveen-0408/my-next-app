"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    function initializeTradingView(symbol) {
      // Remove any existing widget before creating a new one
      document.getElementById("tradingview_chart").innerHTML = "";

      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: "tradingview_chart",
          width: "100%",
          height: 500, // Ensure height is a number
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
        console.error("❌ TradingView library is not loaded yet!");
      }
    }

    if (!window.TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ TradingView script loaded.");
        initializeTradingView("FX:EURUSD");
      };
      script.onerror = () => {
        console.error("❌ Failed to load TradingView script.");
      };
      document.body.appendChild(script);
    } else {
      initializeTradingView("FX:EURUSD");
    }

    // Handle currency selection change
    function handleCurrencyChange(e) {
      initializeTradingView(e.target.value);
    }

    const selector = document.getElementById("currencySelector");
    if (selector) {
      selector.addEventListener("change", handleCurrencyChange);
    }

    return () => {
      if (selector) {
        selector.removeEventListener("change", handleCurrencyChange);
      }
    };
  }, []);

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
        <select id="currencySelector">
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

      <style jsx>{`
        .dashboard-container {
          display: flex;
          gap: 20px;
        }
        .sidebar {
          width: 200px;
          background-color: #2c3e50;
          padding: 20px;
          border-radius: 8px;
        }
        .sidebar h2 {
          color: white;
          text-align: center;
        }
        .sidebar button {
          display: block;
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          background-color: #1abc9c;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
        }
        .sidebar button:hover {
          background-color: #16a085;
        }
        .tradingview-widget-container {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
