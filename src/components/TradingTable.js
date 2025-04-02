// components/TradingTable.js
"use client";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";  // ✅ Correct for Pages Router
import styles from '@/app/styles/Account.module.css';

export default function TradingTable() {
  const router = useRouter();
  useEffect(() => {
    // Load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch USD/INR rates
    const fetchUsdInrRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        const usdInr = data.rates.INR;
        document.getElementById('bidPrice').innerText = (usdInr - 0.02).toFixed(2);
        document.getElementById('askPrice').innerText = (usdInr + 0.02).toFixed(2);
        document.getElementById('lowPrice').innerText = (usdInr - 0.5).toFixed(2);
        document.getElementById('highPrice').innerText = (usdInr + 0.5).toFixed(2);
      } catch (error) {
        console.error('Error fetching USD/INR rates:', error);
      }
    };

    // Initialize TradingView widgets when script is loaded
    script.onload = () => {
      const commodities = [
        { id: 'tradingview_gold', symbol: 'TVC:GOLD', container: 'tradingview_gold' },
        { id: 'tradingview_silver', symbol: 'TVC:SILVER', container: 'tradingview_silver' },
        { id: 'tradingview_future_gold', symbol: 'COMEX:GC1!', container: 'tradingview_future_gold' },
        { id: 'tradingview_future_silver', symbol: 'COMEX:SI1!', container: 'tradingview_future_silver' },
        { id: 'tradingview_future_copper', symbol: 'COMEX:HG1!', container: 'tradingview_future_copper' },
        { id: 'tradingview_oil', symbol: 'TVC:USOIL', container: 'tradingview_oil' },
        { id: 'tradingview_gas', symbol: 'NYMEX:NG1!', container: 'tradingview_gas' },
        { id: 'tradingview_platinum', symbol: 'TVC:PLATINUM', container: 'tradingview_platinum' },
        { id: 'tradingview_palladium', symbol: 'TVC:PALLADIUM', container: 'tradingview_palladium' },
        { id: 'tradingview_brent', symbol: 'TVC:UKOIL', container: 'tradingview_brent' },
        { id: 'tradingview_wheat', symbol: 'CBOT:ZW1!', container: 'tradingview_wheat' },
        { id: 'tradingview_corn', symbol: 'CBOT:ZC1!', container: 'tradingview_corn' },
        { id: 'tradingview_soybeans', symbol: 'CBOT:ZS1!', container: 'tradingview_soybeans' },
      ];

      commodities.forEach(commodity => {
        new window.TradingView.widget({
          width: '100%',
          height: 80,
          symbol: commodity.symbol,
          interval: 'D',
          timezone: 'exchange',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: true,
          allow_symbol_change: false,
          hide_side_toolbar: true,
          container_id: commodity.container
        });
      });
    };

    // Initial fetch and set interval
    fetchUsdInrRates();
    const interval = setInterval(fetchUsdInrRates, 5000);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.body.removeChild(script);
    };
  }, []);

  const navigateToTradeExecution = (commodity) => {
    router.push(`dashboard/tradeexecute?commodity=${encodeURIComponent(commodity)}`);
    
  };
  return (
    <>
      <table id="symbolTable" className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Bid Price</th>
            <th>Ask Price</th>
            <th>Low (L)</th>
            <th>High (H)</th>
          </tr>
        </thead>
        <tbody>
          <tr id="usdInrRow" onClick={() => navigateToTradeExecution('USD/INR')}>
            <td>USD/INR</td>
            <td id="bidPrice">Loading...</td>
            <td id="askPrice">Loading...</td>
            <td id="lowPrice">Loading...</td>
            <td id="highPrice">Loading...</td>
          </tr>
        </tbody>
      </table>

      <table id="commodity" className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th colSpan="4"></th>
          </tr>
        </thead>
        <tbody>
          <tr id="Spot Gold" >
            <td>Spot Gold</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_gold"></div>
              </div>
            </td>
          </tr>
          <tr id="Spot Silver" >
            <td>Spot Silver</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_silver"></div>
              </div>
            </td>
          </tr>
          <tr id="Future Gold" >
            <td>Future Gold</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_future_gold"></div>
              </div>
            </td>
          </tr>
          <tr id="Future Silver" >
            <td>Future Silver</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_future_silver"></div>
              </div>
            </td>
          </tr>
          <tr id="Future Copper" >
            <td>Future Copper</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_future_copper"></div>
              </div>
            </td>
          </tr>
          <tr id="Crude Oil" >
            <td>Crude Oil</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_oil"></div>
              </div>
            </td>
          </tr>
          <tr id="Natural Gas" >
            <td>Natural Gas</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_gas"></div>
              </div>
            </td>
          </tr>
          <tr id="Platinum" >
            <td>Platinum</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_platinum"></div>
              </div>
            </td>
          </tr>
          <tr id="Palladium" >
            <td>Palladium</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_palladium"></div>
              </div>
            </td>
          </tr>
          <tr id="Brent Crude Oil" >
            <td>Brent Crude Oil</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_brent"></div>
              </div>
            </td>
          </tr>
          <tr id="Wheat" >
            <td>Wheat</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_wheat"></div>
              </div>
            </td>
          </tr>
          <tr id="Corn" >
            <td>Corn</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_corn"></div>
              </div>
            </td>
          </tr>
          <tr id="Soybeans" >
            <td>Soybeans</td>
            <td colSpan="4">
              <div className="tradingview-widget-container">
                <div id="tradingview_soybeans"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}