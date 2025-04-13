import { useEffect, useState } from "react";

export default function Commodities() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCommodities = async () => {
      const res = await fetch("https://script.google.com/macros/s/AKfycbxyHcZFtJaQjT7qwDuQe93pWGyqSPtIZCgMKVUF54SdXO9Nm4KCJ5qYKVAsHG61ZQ3NXQ/exec"); // Replace with your URL
      const json = await res.json();
      setData(json);
    };

    fetchCommodities();
    const interval = setInterval(fetchCommodities, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Live Commodities Prices</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Commodity</th>
            <th className="border p-2">Bid</th>
            <th className="border p-2">Ask</th>
            <th className="border p-2">Low</th>
            <th className="border p-2">High</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.bid}</td>
              <td className="border p-2">{item.ask}</td>
              <td className="border p-2">{item.low}</td>
              <td className="border p-2">{item.high}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
