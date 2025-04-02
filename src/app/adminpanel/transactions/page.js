"use client";
import { useState, useEffect } from "react";
import { db, collection, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from "@/firebase/config";
import "@/app/styles/Deposit.module.css";

export default function Admin() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pendingTransactions"), (snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id, userId, amount, type, upiId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentBalance = userSnap.data().balance;
        let updatedBalance = currentBalance;

        if (type === "Deposit") {
          updatedBalance += amount;
        } else if (type === "Withdraw") {
          if (currentBalance < amount) {
            alert("User does not have enough balance!");
            return;
          }
          updatedBalance -= amount;
          alert(`Send ₹${amount} to ${upiId} via UPI before approving.`);
        } else {
          alert("Invalid transaction type!");
          return;
        }

        await updateDoc(userRef, { balance: updatedBalance });
        await deleteDoc(doc(db, "pendingTransactions", id));

        alert(`${type} request approved and balance updated.`);
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel - Approve Transactions</h2>
      {requests.length === 0 && <p>No pending requests</p>}
      {requests.map((request) => (
        <div key={request.id} className="request">
          <p><strong>User:</strong> {request.userName} (ID: {request.userId})</p>
          <p><strong>Type:</strong> {request.type}</p>
          <p><strong>Amount:</strong> ₹{request.amount}</p>
          {request.type === "Withdraw" && <p><strong>UPI ID:</strong> {request.upiId}</p>}
          <p><strong>Status:</strong> {request.status}</p>
          <button onClick={() => handleApprove(request.id, request.userId, request.amount, request.type, request.upiId)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
