"use client";
    import { useState, useEffect, useCallback } from "react";
    import { db, doc, getDoc, updateDoc, collection, addDoc, serverTimestamp} from "@/firebase/config";
    import { useSearchParams, useRouter } from "next/navigation"; 
    import { auth } from "@/firebase/config"; // Firebase Authentication


    


    const TradeExecution = ({ commodityData }) => {
        const [data, setData] = useState(null);
        const router = useRouter();
        const searchParams = useSearchParams(); // ✅ Read asset from URL
        const [user, setUser] = useState(null);
        const [userId, setUserId] = useState(null);
        const [selectedAsset, setSelectedAsset] = useState("USD/INR"); // Default value
        const [tradeType, setTradeType] = useState("Market Order");
        const [lotSize, setLotSize] = useState(0);
        const [bidPrice, setBidPrice] = useState(null);
        const [askPrice, setAskPrice] = useState(null);
        const [price, setPrice] = useState(0);  // ✅ Fix: Define price state
        const [stopPrice, setStopPrice] = useState(0);
        const [limitPrice, setLimitPrice] = useState(0);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        console.log("🎯 Received commodityData:", commodityData);
        console.log("🎯 Is Array?", Array.isArray(commodityData));


    

        useEffect(() => {
            const assetFromURL = searchParams.get("asset");
            console.log("🌐 Asset from URL:", assetFromURL);
            if (assetFromURL) {
                setSelectedAsset(assetFromURL);
            }
        }, [searchParams]);
      
    
        


        
            // ✅ Fetch prices from the commodity table
            const fetchAssetPrices = useCallback(() => {
                try {
                    console.log("🧪 Available symbols:", commodityData.map(c => c.symbol));
                    console.log("🧪 Selected asset:", selectedAsset);
                    console.log("📋 Available Names:", commodityData.map(item => item.name));




                   

                // Fetch data from the table instead of API
                const assetData = commodityData.find(
                    (asset) => asset.symbol === selectedAsset
                );
                if (!assetData) {
                    throw new Error("Selected asset not found");
                }
                       
                setAskPrice(assetData.ask || 0);
                setBidPrice(assetData.bid || 0);
              
                setLoading(false); // ✅ Important!
                console.log("✅ Asset Prices Fetched:", assetData);
                        
                 

                } catch (error) {
                    console.error("Error fetching asset prices:", error);
                    
                    
                    setError(error.message);
                    setBidPrice(0);
                    setAskPrice(0);
                    setLoading(false); // ✅ Important!
                
                }
            }, [commodityData, selectedAsset]);
           
            useEffect(() => {
                if (commodityData && Array.isArray(commodityData) && commodityData.length > 0) {
                    fetchAssetPrices();
                }
            }, [selectedAsset, fetchAssetPrices,commodityData]);






            // Handle Trade Execution
            const handleTrade = async (type, user, userId, lotSize, price, selectedAsset, tradeType, limitPrice = 0, stopPrice = 0, router) => {
                console.log("Trade Execution Attempt:", { 
                    type, user, userId, lotSize, price, selectedAsset, tradeType, limitPrice, stopPrice 
                });

                if (!user) {
                    console.error("Error: User is not logged in or invalid!");
                    alert("User is not logged in or invalid!");
                    return;
                }

                if (lotSize <= 0) {
                    console.error("Error: Invalid lot size!", lotSize);
                    alert("Invalid lot size!");
                    return;
                }




                
                if (price <= 0 || price === null || price === undefined) {
                    console.error("Error: Invalid price!", price);
                    alert("Invalid price!");
                    return;
                }
                const userRef = doc(db, "users", userId);

                try {
                    // Fetch latest user data
                    console.log("Fetching user data from Firestore...");
                    const userSnap = await getDoc(userRef);
                    if (!userSnap.exists()) {
                        throw new Error("User not found!");
                    }

                    const userData = userSnap.data();
                    let executionPrice = price;


                    // ✅ Ensure `symbol` is defined
                    const symbol = selectedAsset || "Unknown Asset"; // Fix for undefined symbol
                    console.log("Executing trade for:", symbol);
                    

                    // ✅ **Logic for Different Order Types**
                    console.log("Processing order type:", tradeType);
                    // Ensure tradeType is defined and valid
                    if (!tradeType) {
                        console.error("Trade Type is undefined! Please select a trade type.");
                        alert("Trade Type is not selected. Please choose a trade type.");
                        return;
                    }

                    if (tradeType === "Market" || tradeType === "Market Order") {
                        if (type === "Buy") {
                            console.log("Market Buy Order: Executing at Ask Price:", askPrice);
                            executionPrice = askPrice; // Execute Buy at Ask Price
                        } else if (type === "Sell") {
                            console.log("Market Sell Order: Executing at Bid Price:", bidPrice);
                            executionPrice = bidPrice; // Execute Sell at Bid Price
                        } else {
                            console.error("Invalid Order Type for Market Order:", type);
                            throw new Error("Invalid Order Type for Market Order");
                        }
                        
                    }
                    else if (tradeType === "Limit") {
                        console.log("Limit Order: Checking conditions...");
                        if ((type === "Buy" && price > limitPrice) || (type === "Sell" && price < limitPrice)) {
                            console.warn("Limit Order Not Met. Order Pending...");
                            alert("Limit Order Not Met. Order Pending...");
                            return;
                        }   
                        console.log("Limit Order Met: Executing at limit price:", limitPrice);
                        executionPrice = limitPrice;
                    } else if (tradeType === "Stop Loss") {
                        console.log("Stop Loss Order: Checking conditions...");
                        if ((type === "Buy" && price < stopPrice) || (type === "Sell" && price > stopPrice)) {
                            console.warn("Stop-Loss Not Triggered. Order Pending...");
                            alert("Stop-Loss Not Triggered. Order Pending...");
                            return;
                        }
                        console.log("Stop Loss Triggered: Converting to market order at stop price:", stopPrice);
                        executionPrice = stopPrice; // Convert to market order once triggered
                    
                    } else {
                        console.error("Error: Invalid trade type!", tradeType);
                        throw new Error("Invalid trade type!");
                    }

                
                    const cost = lotSize * executionPrice;
                    let updatedBalance = userData.balance;
                    let updatedPortfolio = { ...userData.portfolio };


                    console.log("Trade Type:", tradeType);
                    console.log("Checking symbol value:", symbol); // Should not be undefined
                    console.log("Symbol:", symbol);
                    console.log("Order Type:", type);
                    console.log("Lot Size:", lotSize);
                    console.log("Execution Price:", executionPrice);
                    console.log("Total Cost:", cost);
                    console.log("User Balance Before Trade:", updatedBalance);

                    // ✅ **Buy & Sell Logic**
                    console.log("Processing trade:", type);
                    if (type === "Buy") {
                        console.log("Checking balance:", userData.balance, "Required:", cost);
                        if (userData.balance < cost) {
                            alert("Insufficient balance!");
                            return;
                        }
                        updatedBalance -= cost;
                        updatedPortfolio[selectedAsset] = (updatedPortfolio[selectedAsset] || 0) + lotSize;
                        console.log("Buy Order Executed: New Balance:", updatedBalance);


                    } else if (type === "Sell") {
                        console.log("Checking holdings:", updatedPortfolio[selectedAsset], "Selling:", lotSize);
                        if (!updatedPortfolio[selectedAsset] || updatedPortfolio[selectedAsset] < lotSize) {
                            alert("Insufficient holdings!");
                            return;
                        }
                        updatedBalance += cost;
                        updatedPortfolio[selectedAsset] -= lotSize;
                        console.log("Sell Order Executed: New Balance:", updatedBalance);
                    }

                    // ✅ **Update Firestore Database**
                    console.log("Updating user balance and portfolio in Firestore...");
                    await updateDoc(userRef, {
                        balance: updatedBalance,
                        portfolio: updatedPortfolio
                    });
                    console.log("Firestore Update Successful!");

                    // ✅ **Record Transaction**
                    console.log("Recording transaction in Firestore...");
                    await addDoc(collection(db, "transactions"), {
                        
                        userId,
                        type,
                        asset: selectedAsset,
                        lotSize,
                        price: executionPrice,
                        total: cost,
                        orderType: tradeType,
                        timestamp: serverTimestamp(),
                    });
        
                    console.log(`${type} Order Executed Successfully!`);
                    alert(`${type} Order Executed!`);
                    router.refresh();
                } catch (error) {
                    console.error("Trade Execution Error:", error);
                    alert("Trade execution failed. Please try again.");
                }
            };
            
        
            
        // Handle lot size change
        const adjustLotSize = (value) => {
            setLotSize((prev) => Math.max(0, (prev + value).toFixed(1))); // Ensures non-negative values
        };


        
        

        
        // ✅ Fetch logged-in user ID from Firebase Auth
        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    router.push("/login"); // Redirect if not logged in
                }
            });
            return () => unsubscribe();
        }, [router]);

        // ✅ Fetch User Data (Balance & Portfolio) from Firestore
        useEffect(() => {
            if (!userId) return;
            const fetchUserData = async () => {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUser(userSnap.data());
                }
            };
            fetchUserData();
        }, [userId]);

        

        

        

        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Trade Execution</h2>
                <p>Selected Asset: <strong>{selectedAsset}</strong></p>

                

                {/* ✅ Trade Type Selection */}
                <label style={styles.label}>Trade Type:</label>
                <select style={styles.select} value={tradeType} onChange={(e) => setTradeType(e.target.value)}>
                    <option value="Market">Market Order</option>
                    <option value="Limit">Limit Order</option>
                    <option value="Stop Loss">Stop Loss Order</option>
                </select>

                <label style={styles.label}>Lot Size:</label>

                <div style={styles.lotSizeButtons}>
                    {[-0.5, -0.1, 0.1, 0.5].map(value => (
                    <button key={value} style={styles.lotButton} onClick={() => adjustLotSize(value)}>
                        {value > 0 ? `+${value}` : value}
                    </button>
                    ))}
                </div>

                <label style={styles.label}>Lot Size:</label>
                <input type="number" style={styles.input} value={lotSize} readOnly />


                {/* Buy/Sell Section */}

                <div style={styles.buttonContainer}>
                    <div style={styles.sellSection}>
                        <span style={styles.price}>
                        {console.log("🎯 Render Bid Price:", bidPrice, "Loading:", loading)}
                        {bidPrice !== null && !loading ? bidPrice.toFixed(2) : "Fetching..."}
                        </span>
                        <button style={styles.sellButton} 
                        onClick={() => handleTrade("Sell", user, userId, lotSize, bidPrice, selectedAsset, tradeType, limitPrice, stopPrice, router )}
                        >
                            Sell
                        </button>
                </div>

                <div style={styles.buySection}>
                    <span style={styles.price}>
                    {console.log("🎯 Render Ask Price:", askPrice, "Loading:", loading)}
                    {askPrice !== null && !loading ? askPrice.toFixed(2) : "Fetching..."}
                    </span>
                    <button style={styles.buyButton} 
                    onClick={() => handleTrade("Buy", user, userId, lotSize, askPrice, selectedAsset, tradeType, limitPrice, stopPrice, router)}
                    >
                    Buy
                    </button>
                </div>

                </div>
            </div>
        );
    };

    
    // ✅ Styles Object
    const styles = {
        container: {
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textAlign: "center",
        },
        heading: {
            fontSize: "20px",
            marginBottom: "10px",
        },
        label: {
            fontWeight: "bold",
            display: "block",
            marginTop: "10px",
        },
        select: {
            width: "100%",
            padding: "8px",
            marginTop: "5px",
        },
        input: {
            width: "100%",
            padding: "8px",
            marginTop: "5px",
        },
        buttonContainer: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
        },
        buyButton: {
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            width: "48%",
        },
        sellButton: {
            backgroundColor: "#f44336",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            width: "48%",
        },

        lotSizeButtons: {
            display: "flex",
            justifyContent: "center",
            gap: "10px", // Space between buttons
            marginTop: "10px",
            marginBottom: "15px", // Add space below buttons
        },
    };
         export default TradeExecution;