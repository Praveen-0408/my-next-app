import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const url = "https://www.investing.com/commodities/gold"; // Source website
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Modify selector as per the website's structure
    const price = $(".instrument-price_last__KQzyA").text().trim();

    return new Response(JSON.stringify({ goldPrice: price }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
