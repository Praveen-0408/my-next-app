
"use client"; // ✅ Convert to Client Component

import { Suspense } from 'react'
import TradeExecution from "@/components/tradeexecution"
import commodityData from "@/utils/commodity"; 



export default function Page() {
  return (
    <Suspense fallback={<div>Loading trade execution...</div>}>
      <TradeExecution commodityData={commodityData} />
    </Suspense>
  );
}