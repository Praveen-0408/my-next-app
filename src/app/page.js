"use client";

import Link from 'next/link';
import './globals.css'; // Import global styles

export default function Home() {
  return (
    <header className="navbar">
      <h1 className="logo">Rexo Trading</h1>
      <nav>
        <ul className="nav-links">
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/auth/login" className="login-button">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}
