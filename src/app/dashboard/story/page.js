"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            if (!user) {
                console.warn("User is not logged in!");
                return;
            }

            try {
                const q = query(
                    collection(db, "transactions"),
                    where("userId", "==", user.uid),
                    orderBy("timestamp", "desc")
                );
                const querySnapshot = await getDocs(q);

                const history = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setTransactions(history);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        if (user) {
            fetchTransactionHistory();
        }
    }, [user]);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Transaction History</h2>

            {transactions.length === 0 ? (
                <p style={styles.noTransaction}>No transactions found.</p>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Asset</th>
                                <th style={styles.th}>Lot Size</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Total</th>
                                <th style={styles.th}>Order Type</th>
                                <th style={styles.th}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td style={styles.td}>{tx.type}</td>
                                    <td style={styles.td}>{tx.asset}</td>
                                    <td style={styles.td}>{tx.lotSize}</td>
                                    <td style={styles.td}>${tx.price.toFixed(2)}</td>
                                    <td style={styles.totalAmount}>${tx.total.toFixed(2)}</td>
                                    <td style={styles.td}>{tx.orderType}</td>
                                    <td style={styles.td}>{tx.timestamp ? new Date(tx.timestamp.seconds * 1000).toLocaleString() : "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ✅ Define styles inside the same file
const styles = {
    container: {
        padding: "1.5rem",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "1rem",
        textAlign: "center",
    },
    noTransaction: {
        color: "red",
        textAlign: "center",
    },
    tableContainer: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #ddd",
    },
    th: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px",
        border: "1px solid #ddd",
    },
    td: {
        padding: "10px",
        border: "1px solid #ddd",
        textAlign: "center",
    },
    totalAmount: {
        fontWeight: "bold",
        color: "green",
        padding: "10px",
        border: "1px solid #ddd",
        textAlign: "center",
    },
};

export default TransactionHistory;
