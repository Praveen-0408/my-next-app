"use client";

import { useState } from "react";

export default function WithdrawFunds() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [transactions, setTransactions] = useState([]);

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Enter a valid withdrawal amount!");
      return;
    }
    const newTransaction = {
      id: transactions.length + 1,
      type: "Withdraw",
      amount: parseFloat(amount),
      method,
      date: new Date().toLocaleString(),
    };
    setTransactions([newTransaction, ...transactions]);
    alert(`Withdrawal of ${amount} USD via ${method} successful!`);
    setAmount("");
  };

  return (
    <div className="withdraw-container">
      <h2>Withdraw Funds</h2>

      <label>Amount (USD):</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />

      <label>Payment Method:</label>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option>Bank Transfer</option>
        <option>UPI</option>
        <option>Crypto (BTC/ETH)</option>
        <option>Credit/Debit Card</option>
      </select>

      <button onClick={handleWithdraw}>Withdraw</button>

      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.type}</td>
              <td>{txn.amount} USD</td>
              <td>{txn.method}</td>
              <td>{txn.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .withdraw-container {
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
          border-radius: 10px;
          background: #f8f9fa;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        label {
          display: block;
          margin-top: 10px;
          font-weight: bold;
        }
        input, select {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        button {
          background: #dc3545;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
        button:hover {
          background: #c82333;
        }
        table {
          width: 100%;
          margin-top: 15px;
          border-collapse: collapse;
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
      `}</style>
    </div>
  );
}
