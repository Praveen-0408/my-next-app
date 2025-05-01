"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, query, where, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";





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
    const [balance, setBalance] = useState(0);
    const [livePrices, setLivePrices] = useState({});
    const [commodityPrices, setCommodityPrices] = useState({});  // <-- Added state for commodity prices




    const fetchCommodities = async () => {
        try {
          const res = await fetch('/api/commodities', { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch');
      
          const json = await res.json();
          console.log('Received data:', json); // Check full API response
      
          const allowedSymbols = [
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
      
          // 🔄 Map data to key: symbol, value: ask price
          const prices = {};
          allowedSymbols.forEach(symbol => {
            const item = json.find(entry => entry.symbol === symbol);
            if (item && item.ask) {
              prices[symbol] = parseFloat(item.ask).toFixed(2);
            }
          });
      
          setData(prices); // prices = { "GOLD/FUT": 2345.56, "USD/INR": 83.21, ... }
        } catch (err) {
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      };
      
    

    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                await fetchBalance(currentUser.uid);
                await fetchTransactions(currentUser.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchBalance = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setBalance(data.balance || 0);
      }
    } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
  


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
  
  const fetchTransactions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "transactions"));
      const fetchedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions(); // ✅ This must be defined above
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

            {/* ✅ Show current balance */}
      <div style={{
        marginBottom: "20px",
        padding: "10px",
        background: "#f0f0f0",
        borderRadius: "6px",
        fontWeight: "bold"
      }}
      >
        Current Balance: ${balance.toFixed(2)}
      </div>

            {transactions.length === 0 ? (
                <p style={styles.noTransaction}>No transactions found.</p>
            ) : (
                <div style={styles.cardGrid}>
                    
                    {[...transactions]
    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
    .map((tx, index) => {

                                 const assetSymbol = tx.asset.trim().toUpperCase(); // normalize asset name
                                 const priceData = commodityPrices[assetSymbol];
                                 const purchasePrice = tx.price;
                                 let plPercent = "-";
                                 let plPrice = "-";
                                 let presentValue = "-";
                                 let currentPrice = null;

                                 if (priceData && purchasePrice) {
                                    currentPrice = 
                                    tx.type === "Buy" ? priceData.Ask :
                                    tx.type === "Sell" ? priceData.Bid :
                                    null;
                                    if (currentPrice !== null) {
                                        const plValue = ((currentPrice - purchasePrice) / purchasePrice) * 100;
                                        plPercent = plValue.toFixed(2) + "%";

                                         // ✅ Calculate P/L price
                                         const plDecimal = plValue / 100;
                                         const plPriceValue = tx.lotSize * purchasePrice * plDecimal;
                                         plPrice = plPriceValue.toFixed(2);

                                         // ✅ Calculate Present Value using purchasePrice
                                         presentValue = (tx.lotSize * purchasePrice + parseFloat(plPrice)).toFixed(2);

                                         



                                        }
                                }
                                 return (
                                  <div key={tx.id} style={styles.transactionBox}>
                                   <div style={styles.gridContainer}>
                                      
                                
                                      <div><strong></strong> {tx.type}</div>
                                  
                                  

                                    <div><strong></strong> {tx.price.toFixed(2)}</div>
                                    <div>
                                    <strong></strong>{" "}
                                    <strong>
                                    <span style={{ color: plPrice < 0 ? "red" : "green" }}>{plPrice !== "-" ? `${plPrice}` : "-"}</span>
                                    </strong>
                                    </div>
                                    <div><strong></strong> {tx.asset}</div>
                                    
                                    <div>
                                    <strong></strong>
                                    {priceData ? `${priceData.Ask?.toFixed(2)} - ${priceData.Bid?.toFixed(2)}` : 'N/A'}
                                    </div>
                                    <div>
                                    <div><strong></strong> {tx.timestamp ? new Date(tx.timestamp.seconds * 1000).toLocaleString() : "N/A"}</div>
                                    
                                    </div>
                                    
                                    <div><strong></strong> {tx.lotSize}</div>
                                   
                                    </div>
                                    </div>
                            
                                
                          
                                
                            );
                        })}   
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
        maxWidth: "1200px",
        margin: "0 auto",
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
  

    transactionBox: {
      background: "#f9f9f9",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
    },
    rowContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      
    },
    column: {
      flex: 1,
      fontSize: "14px",
      color: "#333",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      fontSize: "14px",
      color: "#333",
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
