"use client";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Rexo Trader</h2>
        <button onClick={() => router.push("/dashboard/trade-now")}>Trade Now</button>
        <button onClick={() => router.push("/dashboard/commodity-trading")}>Commodity Trading</button>
        <button onClick={() => router.push("/dashboard/watchlist")}>Watchlist</button>
        <button onClick={() => router.push("/dashboard/portfolio")}>Portfolio</button>
        <button onClick={() => router.push("/dashboard/deposit")}>Deposit Funds</button>
        <button onClick={() => router.push("/dashboard/withdraw")}>Withdraw Funds</button>
        <button onClick={() => router.push("/dashboard/account")}>My Account</button>
        <button onClick={() => router.push("/dashboard/settings")}>Settings</button>
      </div>

      <div className="tradingview-widget-container">
        <div id="tradingview_chart"></div>
      </div>
    </div>
  );
};

export default Dashboard;
