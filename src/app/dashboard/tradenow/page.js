'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TradeNow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCommodities = async () => {
    try {
      const res = await fetch('/api/commodities', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');

      const json = await res.json();
      console.log('Received data:', json); // ⬅️ Check what you're getting

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

  

      setData(json);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodities();
    const interval = setInterval(fetchCommodities, 60000); // Fetch every 1 minute (60,000 ms)
    return () => clearInterval(interval); // Clean up interval when component is unmounted
  }, []);

  const handleRowClick = (item) => {
   
      
    router.push(`/dashboard/tradeexecution?symbol=${encodeURIComponent(item.Symbol)}&ask=${encodeURIComponent(item.Ask)}&bid=${encodeURIComponent(item.Bid)}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Trade Now</h1>

      {loading ? (
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Symbol</th>
                <th style={styles.th}>Price</th> {/* Added price column */}
                <th style={styles.th}>Bid</th>
                <th style={styles.th}>Ask</th>
                <th style={styles.th}>High</th>
                <th style={styles.th}>Low</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data.map((item, i) => (
                  <tr
                    key={i}
                    onClick={() => handleRowClick(item)}
                    style={{
                      ...styles.row,
                      backgroundColor: i % 2 === 0 ? '#fff' : '#f9fafb',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={styles.td}>{item.Name}</td>
                    <td style={styles.td}>{item.Symbol}</td>
                    <td style={styles.td}>{parseFloat(item.Price).toFixed(2)}</td> 
                    <td style={styles.td}>{parseFloat(item.Bid).toFixed(2)}</td>
                    <td style={styles.td}>{parseFloat(item.Ask).toFixed(2)}</td>
                    <td style={styles.td}>{parseFloat(item.High).toFixed(2)}</td>
                    <td style={styles.td}>{parseFloat(item.Low).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem',
  },
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '16rem',
  },
  spinner: {
    width: '2.5rem',
    height: '2.5rem',
    border: '0.25rem solid #000000',
    borderTopColor: 'transparent',
    borderRadius: '9999px',
    animation: 'spin 1s linear infinite',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
  table: {
    width: '100%',
    fontSize: '0.875rem',
    textAlign: 'left',
    color: '#374151',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#000000',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  th: {
    padding: '0.75rem 1rem',
    color: '#ffffff', // Change header text color to black
  },
  td: {
    padding: '0.5rem 1rem',
    fontWeight: '500',
    color: '#000000', // Black text for data rows
  },
  row: {
    transition: 'background-color 0.3s',
  },
};

// Add keyframe manually since inline styles don’t support it
if (typeof window !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  const keyframes =
    `@keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }`;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}
