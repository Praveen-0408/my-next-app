"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for navigation
import axios from "axios";
import "@/app/styles/tradenow.css"; // Import the CSS file


const CommoditiesTable = () => {
    const [commodities, setCommodities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // ✅ Initialize useRouter

    useEffect(() => {
        const fetchCommodities = async () => {
            try {
                const response = await axios.get("/api/commodities");

                console.log("🟢 API Response:", response.data); // ✅ Debugging

                if (response.data && Array.isArray(response.data.body)) {
                    setCommodities(response.data.body);
                } else {
                    throw new Error("Invalid API response format");
                }
            } catch (error) {
                console.error("🔴 Error fetching commodities:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCommodities();
    }, []);

   // ✅ Function to handle row click and pass selected asset to Trade Execution page
    const handleTradeClick = (assetName) => {
        router.push(`/dashboard/tradeexecution?asset=${encodeURIComponent(assetName)}`);
    };

    return (
        <div className="commodities-container">
            <h2 className="commodities-title">Commodities Table</h2>

            {loading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">Error: {error}</p>}

            {!loading && !error && (
                <div className="commodities-table-wrapper">
                    <table className="commodities-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Bid Price</th>
                                <th>Ask Price</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Exchange</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commodities.length > 0 ? (
                                commodities.map((item, index) => (
                                    <tr 
                                        key={index}
                                        onClick={() => handleTradeClick(item.shortName)}
                                        className="clickable-row" // ✅ Add styling
                                    >
                                        <td>{item.shortName}</td>
                                        <td>${item.bid || "N/A"}</td>
                                        <td>${item.ask || "N/A"}</td>
                                        <td>${item.regularMarketDayHigh || "N/A"}</td>
                                        <td>${item.regularMarketDayLow || "N/A"}</td>
                                        <td>{item.exchange}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CommoditiesTable;
