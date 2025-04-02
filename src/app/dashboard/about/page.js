
// pages/about.js
import Layout from '@/components/layout';

export default function About() {
  return (
    <Layout title="About Us">
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <p>
          Welcome to Rexo Trader, your trusted platform for trading commodities and currencies.
          We provide real-time market data, secure transactions, and a user-friendly interface
          to help you achieve your financial goals.
        </p>
        <p>
          Our mission is to empower traders with the tools and insights they need to succeed in
          the global markets. Join us today and start trading with confidence!
        </p>
      </div>
    </Layout>
  );
}