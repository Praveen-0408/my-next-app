"use client";
import { useState } from "react";
import { db, addDoc, collection } from "@/firebase/config";
import { toast } from "react-toastify";

const DepositForm = ({ userId }) => {
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const handleDeposit = async () => {
    if (!amount || !transactionId) {
      toast.error("Enter all details!");
      return;
    }
    await addDoc(collection(db, "deposits"), {  
      userId,
      amount: parseFloat(amount),
      transactionId,
      status: "Pending",
      createdAt: new Date(),
    });
    toast.success("Deposit request submitted!");
    setAmount("");
    setTransactionId("");
  };

  return (
    <div>
      <h2>Deposit Funds</h2>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="text" placeholder="Transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
      <button onClick={handleDeposit}>Submit Deposit</button>
    </div>
  );
};

export default DepositForm;



