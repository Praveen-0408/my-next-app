"use client";

import { useState } from "react";

export default function Account() {
  const [user, setUser] = useState({
    fullName: "Vishnu Kumar",
    email: "vishnu@example.com",
    phone: "+91 9876543210",
    country: "India",
    accountId: "FX123456",
    accountType: "Standard",
    leverage: "1:100",
    tradingCurrency: "USD",
    balance: "10,000 USD",
    equity: "10,200 USD",
    marginLevel: "95%",
    profitLoss: "+200 USD",
    kycStatus: "Verified",
    lastLogin: "2025-03-02 10:30 AM",
    depositAmount: "5,000 USD",
    withdrawalAmount: "2,000 USD",
  });

  return (
    <div className="container">
      <h2>Account Details</h2>

      <div><strong>Full Name:</strong> {user.fullName}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Phone:</strong> {user.phone}</div>
      <div><strong>Country:</strong> {user.country}</div>

      <h3>Trading Information</h3>
      <div><strong>Account ID:</strong> {user.accountId}</div>
      <div><strong>Account Type:</strong> {user.accountType}</div>
      <div><strong>Leverage:</strong> {user.leverage}</div>
      <div><strong>Trading Currency:</strong> {user.tradingCurrency}</div>
      <div><strong>Account Balance:</strong> {user.balance}</div>
      <div><strong>Equity:</strong> {user.equity}</div>
      <div><strong>Margin Level:</strong> {user.marginLevel}</div>
      <div><strong>Profit/Loss:</strong> {user.profitLoss}</div>

      <h3>Security & Verification</h3>
      <div><strong>KYC Status:</strong> {user.kycStatus}</div>
      <div><strong>Last Login:</strong> {user.lastLogin}</div>

      <h3>Financial Transactions</h3>
      <div><strong>Deposit Amount:</strong> {user.depositAmount}</div>
      <div><strong>Withdrawal Amount:</strong> {user.withdrawalAmount}</div>

      <br />
      <button className="btn" onClick={() => alert("Edit Account Functionality Coming Soon!")}>
        Edit Account
      </button>

      <style jsx>{`
        .container {
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
          border-radius: 10px;
          background: #f8f9fa;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          text-align: left;
        }
        h2, h3 {
          color: #333;
          border-bottom: 2px solid #ddd;
          padding-bottom: 5px;
        }
        .btn {
          background-color: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
        .btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
