
import { useRouter } from "next/navigation";

// ✅ Exporting commodity data
export const commodityData = [
  { name: "Gold", symbol: "USD/INR", ask: 1952.50, bid: 1948.50, high: 1965.00, low: 1940.00 },
  { name: "Silver", symbol: "SI=F", ask: 24.90, bid: 24.70, high: 25.30, low: 24.50 },
  { name: "Crude Oil", symbol: "CL=F", ask: 75.80, bid: 75.20, high: 77.00, low: 74.50 },
  { name: "Soybean", symbol: "ZS=F", ask: 1342.50, bid: 1338.00, high: 1355.00, low: 1330.00 },
  { name: "Corn", symbol: "ZC=F", ask: 581.50, bid: 578.50, high: 590.00, low: 570.00 },
  { name: "Wheat", symbol: "ZW=F", ask: 652.00, bid: 649.50, high: 660.00, low: 640.00 },
  { name: "Brent Oil", symbol: "BZ=F", ask: 80.10, bid: 79.50, high: 81.00, low: 78.50 },
  { name: "Palladium", symbol: "PA=F", ask: 1253.00, bid: 1248.50, high: 1265.00, low: 1235.00 },
  { name: "Platinum", symbol: "PL=F", ask: 1017.50, bid: 1013.50, high: 1030.00, low: 1005.00 },
  { name: "Natural Gas", symbol: "NG=F", ask: 2.88, bid: 2.82, high: 3.00, low: 2.75 },
  { name: "USD/INR", symbol: "USD/INR", ask: 83.20, bid: 83.00, high: 84.00, low: 82.50 },
];

// ✅ Inline styles
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    cursor: "pointer",
  },
  rowHover: {
    backgroundColor: "#f1f1f1",
  },
  greenText: {
    color: "green",
    fontWeight: "bold",
  },
  redText: {
    color: "red",
    fontWeight: "bold",
  },
};

const CommoditiesTable = () => {
  const router = useRouter();

  const goToTradePage = (commodity) => {
    router.push(
      `/dashboard/tradeexecution?asset=${commodity.symbol}&name=${commodity.name}&ask=${commodity.ask}&bid=${commodity.bid}&high=${commodity.high}&low=${commodity.low}`
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
        Commodities Prices
      </h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Commodity</th>
            <th style={styles.th}>Symbol</th>
            <th style={styles.th}>Ask Price</th>
            <th style={styles.th}>Bid Price</th>
            <th style={styles.th}>High</th>
            <th style={styles.th}>Low</th>
          </tr>
        </thead>
        <tbody>
          {commodityData.map((item, index) => (
            <tr key={index} style={{ ...styles.td, ...styles.rowHover }} onClick={() => goToTradePage(item)}>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}>{item.symbol}</td>
              <td style={{ ...styles.td, ...styles.greenText }}>${item.ask.toFixed(2)}</td>
              <td style={{ ...styles.td, ...styles.redText }}>${item.bid.toFixed(2)}</td>
              <td style={styles.td}>${item.high.toFixed(2)}</td>
              <td style={styles.td}>${item.low.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommoditiesTable;
