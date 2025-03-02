"use client";

export default function About() {
  return (
    <div className="about-container">
      <h1>About Rexo Trading</h1>
      <p>
        Welcome to <strong>Rexo Trading</strong>, your trusted platform for **Forex and Commodity trading**.
        We provide **real-time trading opportunities** in **currencies, gold, silver, and other commodities**.
      </p>

      <h2>Why Choose Us?</h2>
      <ul>
        <li>✔ **Live Forex & Commodity Prices**</li>
        <li>✔ **Secure & Fast Transactions**</li>
        <li>✔ **Advanced Trading Graphs & Analysis**</li>
        <li>✔ **24/7 Customer Support**</li>
      </ul>

      <h2>Our Services</h2>
      <p>
        We offer trading in **major currency pairs, precious metals (gold, silver, bronze)**,
        and **portfolio management** for traders.
      </p>

      <style jsx>{`
        .about-container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #1abc9c;
        }
        ul {
          text-align: left;
          list-style-type: none;
          padding: 0;
        }
        ul li {
          margin-bottom: 10px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
