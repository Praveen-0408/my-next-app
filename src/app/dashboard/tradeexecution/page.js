
"use client"; // ✅ Convert to Client Component

import TradeExecution from "@/components/tradeexecution";
import { commodityData } from "@/utils/commodity"; // ✅ Move to a shared utility

export default function TradeExecutionPage() {
    return <TradeExecution commodityData={commodityDa} />;
}
