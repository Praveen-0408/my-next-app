"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Get user ID from URL
import { db } from "@/firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function UserTransactions() {
  const { id } = useParams(); // ✅ Get user ID from URL
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", id),
          orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);
        const history = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(history);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (id) fetchTransactions();
  }, [id]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">User Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Type</th>
              <th className="border p-2">Asset</th>
              <th className="border p-2">Lot Size</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Order Type</th>
              <th className="border p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="text-center">
                <td className="border p-2">{tx.type}</td>
                <td className="border p-2">{tx.asset}</td>
                <td className="border p-2">{tx.lotSize}</td>
                <td className="border p-2">{tx.price}</td>
                <td className="border p-2">{tx.total}</td>
                <td className="border p-2">{tx.orderType}</td>
                <td className="border p-2">
                  {tx.timestamp
                    ? new Date(tx.timestamp.seconds * 1000).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
