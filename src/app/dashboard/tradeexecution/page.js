
"use client"; // ✅ Convert to Client Component

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import TradeExecution from "@/components/tradeexecution";

export default function Page() {
  const [commodityData, setCommodityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch commodity data from the API
  const fetchCommodityData = async () => {
    try {
      const res = await fetch("/api/commodities", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch data from the server");

      const data = await res.json();
      setCommodityData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodityData();
  }, []);

  if (loading) {
    return <div>Loading trade execution...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Suspense fallback={<div>Loading trade execution...</div>}>
      <TradeExecution commodityData={commodityData} />
    </Suspense>
  );
}
