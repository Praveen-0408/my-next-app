"use client";

import Link from 'next/link';
import Image from 'next/image';
import './globals.css'; // Import global styles

export default function Home() {
  return (
    <div>
    <header className="navbar">
      <h1 className="logo">Rexo Trading</h1>
      <nav>
        <ul className="nav-links">
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/auth/login" className="login-button">Start Trading</Link></li>
        </ul>
      </nav>
    </header>

   {/* Display SVG Image */}
   <div className="image-container">
   <Image src="/09a4b4a141e5987305ed98a7e5a33c42.svg" alt="Trading Chart" width={2000} height={600} />
 </div>
</div>
);
}