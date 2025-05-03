
"use client"; // Mark this as a client component

// pages/index.js (Main page)
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/sidebar2';
import SearchBar from '@/components/SearchBar';
import MenuDropdown from '@/components/MenuDropdown';
import styles from '@/app/styles/Home.module.css'; // assuming index.js and Home.module.css are in the same folder


import { useRouter } from 'next/navigation';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
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


  const toggleMenu = () => {
    setMenuOpen((prev) => {
      console.log('Menu open state:', !prev); // Debug log to verify state change
      return !prev;
    });
  };

  

  return (
    <div>
      <Head>
        <title>Rexo Trader</title>
       
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Rexo Trader</h1>
        <button className={styles.menuBtn} onClick={toggleMenu}>
          ☰
        </button>
        <div ref={menuRef}>
          <MenuDropdown isActive={menuOpen} toggleMenu={toggleMenu} />
        </div>
        <SearchBar />
        
        <Sidebar />

        <div Style={inlineStyles.container}>
      <h1 style={inlineStyles.title}></h1>

      {loading ? (
        <div Style={inlineStyles.spinnerWrapper}>
          <div style={inlineStyles.spinner}></div>
        </div>
      ) : (
        <div style={inlineStyles.tableWrapper}>
          <table style={inlineStyles.table}>
            <thead>
              <tr style={inlineStyles.headerRow}>
                <th style={inlineStyles.th}>Name</th>
                <th style={inlineStyles.th}>Symbol</th>
                <th style={inlineStyles.th}>Price</th> {/* Added price column */}
              
              
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data
                .filter(item => item.Symbol) // Filter out items where Symbol is empty or undefined
                .map((item, i) => (
                  <tr
                    key={i}
                    onClick={() => handleRowClick(item)}
                    style={{
                      ...styles.row,
                      backgroundColor: i % 2 === 0 ? '#fff' : '#f9fafb',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={inlineStyles.td}>{item.Name}</td>
                    <td style={inlineStyles.td}>{item.Symbol}</td>
                    <td style={inlineStyles.td}>
                    <div style={inlineStyles.price}>{parseFloat(item.Price).toFixed(2)}</div>
                    <div style={inlineStyles.subPrice}>Bid: <span style={inlineStyles.bid}>{parseFloat(item.Bid).toFixed(2)}</span></div>
                    <div style={inlineStyles.subPrice}>Ask: <span style={inlineStyles.ask}>{parseFloat(item.Ask).toFixed(2)}</span></div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
    )}
    </div>

      </main>
    </div>
  );
}

const inlineStyles = {
  container: {
    padding: '1.5rem',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    paddingBottom: '9rem', // 👈 Add this line
  },
  title: {
    fontSize: '1.5rem', // slightly smaller for phones
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '12rem',
  },
  spinner: {
    width: '2rem',
    height: '2rem',
    border: '0.25rem solid #000000',
    borderTopColor: 'transparent',
    borderRadius: '9999px',
    animation: 'spin 1s linear infinite',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px   rgba(45, 10, 221, 0.1)',
    backgroundColor: 'white',
    marginBottom: '6rem', // ✅ Add this if spacing still feels tight
  },
  table: {
    width: '100%',
    fontSize: '0.75rem',
    textAlign: 'left',
    color: '#374151',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#1D4ED8', // blue
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  th: {
    padding: '0.5rem 1rem',
    color: '#ffffff', // Change header text color to black
    fontSize: '0.75rem',
  },
  td: {
    padding: '0.5rem 0.5rem', // Reduced padding between Name and Symbol
    fontWeight: '500',
    color: '#000000', // Black text for data rows
    fontSize: '0.75rem',
    wordBreak: 'break-word', // ensure text doesn't overflow
  },
  subPrice: {
    fontSize: '0.65rem',
    color: '#6b7280',
    marginTop: '0.1rem',
  },

bid: {
  color: '#dc2626', // red
},
ask: {
  color: '#16a34a', // green
},
price: {
  fontSize: '0.95rem',
  fontWeight: 'bold',
},
  row: {
    transition: 'background-color 0.3s',
  },
  // Responsive styles for mobile
  '@media (max-width: 768px)': {

  
    title: {
      fontSize: '1.25rem', // Smaller title on mobile
    },
    th: {
      fontSize: '0.625rem', // Smaller header text
      padding: '0.25rem',
    },
    td: {
      fontSize: '0.625rem', // Smaller data text
      padding: '0.25rem',
    },
    price: {
      fontSize: '1.1rem',  // Slightly smaller price
    },
    subPrice: {
      fontSize: '0.6rem', // Smaller sub price
    },
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

