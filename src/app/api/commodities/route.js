import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
    try {
        const response = await axios.get(
            "https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes",
            {
                params: {
                    ticker: "GC=F,SI=F,CL=F,ZS=F,ZC=F,ZW=F,BZ=F,PA=F,PL=F,NG=F,USDINR=X" // Gold, Silver, Crude Oil
                },
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com",
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("🔴 API Error:", error?.response?.data || error.message);
        return NextResponse.json(
            { error: "Failed to fetch commodities", details: error?.response?.data || error.message },
            { status: 500 }
        );
    }
}
