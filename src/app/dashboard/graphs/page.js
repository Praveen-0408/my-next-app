"use client"; // Next.js App Router requires client-side execution

import { useEffect, useState } from "react";

export default function Graphs() {
  const [selectedCommodity, setSelectedCommodity] = useState("TVC:GOLD"); // Default: Gold Spot

  useEffect(() => {
    // Load TradingView script dynamically
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      createTradingViewWidgetUSDINR();
      initializeCommodityChart(selectedCommodity);
    };
    document.body.appendChild(script);
  }, [selectedCommodity]); // Re-run when commodity changes

  function createTradingViewWidgetUSDINR() {
    new window.TradingView.widget({
      container_id: "tradingview_usdinr",
      width: "100%",
      height: "500",
      symbol: "FX_IDC:USDINR",
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

  function initializeCommodityChart(symbol) {
    new window.TradingView.widget({
      container_id: "tradingview_commodity",
      width: "100%",
      height: "500",
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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <h2>Trading Charts</h2>

      {/* USD/INR Trading Graph */}
      <div className="tradingview-widget-container">
        <h3>USD/INR Trading</h3>
        <div id="tradingview_usdinr"></div>
      </div>

      <br />

      {/* Commodity Trading Graph */}
      <h2>Commodity Trading</h2>
      <label htmlFor="commoditySelector">Choose Commodity:</label>
      <select
        id="commoditySelector"
        value={selectedCommodity}
        onChange={(e) => setSelectedCommodity(e.target.value)}
        style={{ margin: "10px", padding: "5px" }}
      >
        <option value="COMEX:GC1!">Future Gold</option>
        <option value="TVC:GOLD">Spot Gold</option>
        <option value="COMEX:SI1!">Future Silver</option>
        <option value="TVC:SILVER">Spot Silver</option>
        <option value="COMEX:HG1!">Future Copper</option>
        <option value="LME:ALI1!">Aluminium</option>
        <option value="NYMEX:CL1!">Crude Oil</option>
        <option value="NYMEX:NG1!">Natural Gas</option>
        <option value="NYMEX:PL1!">Platinum</option>
      </select>

      <div className="tradingview-widget-container">
        <div id="tradingview_commodity"></div>
      </div>
    </div>
  );
}
