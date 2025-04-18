"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios"; // for fetching live prices




const supportedAssets = [
    "USD/INR",
    "GOLD/FUT",
    "XAU/USD",
    "SILVER/FUT",
    "XAG/USD",
    "COPPER/USD",
    "PLATINUM/USD",
    "PALLADIUM/USD",
    "WTI/USD",
    "BRENT/USD",
    "NG/USD",
    "WHEAT/USD",
    "CORN/USD",
    "SOYBEANS/USD",
  ];

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);
    const [commodityPrices, setCommodityPrices] = useState({});  // <-- Added state for commodity prices

    

    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
        });
        return () => unsubscribe();
    }, []);


    // Fetch live commodity prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbwVnj3joWYzAZFzzFu3f_Rvv395I1lp-jhNgMTqLvMicsqk5mX1pl9i7SZaa3JVIZjT4Q/exec");
        const data = await res.json();
        console.log(data)
        const pricesMap = {};
        data.forEach((row) => {
            if (row.Symbol && row.Price) {
                pricesMap[row.Symbol] = {
                    Ask: parseFloat(row.Ask?.toString().replace(/,/g, '') || row.Price),
                    Bid: parseFloat(row.Bid?.toString().replace(/,/g, '') || row.Price),
                };
            }

        });
        console.log("Live Prices:", pricesMap); // ✅ Log the live prices
        setCommodityPrices(pricesMap);
    } catch (error) {
        console.error("Error fetching live prices:", error);
    }

    };

    fetchPrices();
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
                                <th style={styles.th}>P/L%</th>
                                <th style={styles.th}>Order Type</th>
                                <th style={styles.th}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => {
                                 const assetSymbol = tx.asset.trim().toUpperCase(); // normalize asset name
                                 const priceData = commodityPrices[assetSymbol];
                                 const purchasePrice = tx.price;
                                 let plPercent = "-";

                                 if (priceData && purchasePrice) {
                                    const currentPrice =
                                    tx.type === "Buy" ? priceData.Ask :
                                    tx.type === "Sell" ? priceData.Bid :
                                    null;
                                    if (currentPrice) {
                                        const plValue = ((currentPrice - purchasePrice) / purchasePrice) * 100;
                                        plPercent = plValue.toFixed(2) + "%";
                                        console.log(
                                            `Asset: ${tx.asset} | Type: ${tx.type} | Buy/Sell Price: ${purchasePrice} | Current Price: ${currentPrice} | P/L%: ${plPercent}`
                                          );
                                          
                                    } else {
                                        console.log(`⚠️ No currentPrice found for asset: ${tx.asset}, type: ${tx.type}`);
                                    }
                                }else {

                                    console.log(`⚠️ Missing price data for: ${tx.asset}`);
                                }
                                 return (
                                <tr key={tx.id}>
                                    <td style={styles.td}>{tx.type}</td>
                                    <td style={styles.td}>{tx.asset}</td>
                                    <td style={styles.td}>{tx.lotSize}</td>
                                    <td style={styles.td}>${tx.price.toFixed(2)}</td>
                                    <td style={styles.td}>{plPercent}</td>
                                    <td style={styles.td}>{tx.orderType}</td>
                                    <td style={styles.td}>
                                    {tx.timestamp
                                           ? new Date(tx.timestamp.seconds * 1000).toLocaleString()
                                           : "N/A"}
                                           </td>
                                           </tr>
                                           );
                                        })}
                                           
                                
                                   
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
        backgroundColor: "black",
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
