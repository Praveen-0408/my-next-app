"use client";
import { useState } from "react";
import { db, collection, addDoc, serverTimestamp } from "@/firebase/config";
import styles from "../../styles/Deposit.module.css"; // Check path

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleWithdrawRequest = async () => {
    if (!amount || amount <= 0 || !upiId) {
      alert("Please enter a valid amount and UPI ID!");
      return;
    }

    try {
      await addDoc(collection(db, "pendingTransactions"), {
        userId: "USER_ID_HERE", // Replace with actual user ID
        userName: "USER_NAME_HERE", // Replace with actual user name
        type: "Withdraw",
        amount: parseFloat(amount),
        upiId: upiId,
        status: "Pending",
        timestamp: serverTimestamp(),
      });

      alert("Withdrawal request submitted. Admin will process it.");
      setAmount("");
      setUpiId("");
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Withdraw Funds</h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="Enter your UPI ID"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        className={styles.inputField}
      />
      <button onClick={handleWithdrawRequest} className={styles.button}>
        Submit Request
      </button>
    </div>
  );
}