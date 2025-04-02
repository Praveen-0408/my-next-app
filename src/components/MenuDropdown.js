"use client"; // Add this line
import Link from 'next/link';
import styles from '@/app/styles/Home.module.css';

export default function MenuDropdown({ isActive, toggleMenu }) {
  return (
    <div id="menuDropdown" className={`${styles.menuDropdown} ${isActive ? styles.menuDropdownActive : ''}`}>
      <button className={styles.menuBtn} onClick={toggleMenu}>
        ☰
        </button>
      <br /><br /><br />
      <Link href="/dashboard/deposit" onClick={toggleMenu}>
        Deposit Funds
      </Link>
      <Link href="/dashboard/withdraw" onClick={toggleMenu}>
        Withdraw Funds
      </Link>
      <Link href="/dashboard/account" onClick={toggleMenu}>
        My Account
      </Link>
      <Link href="/dashboard/settings" onClick={toggleMenu}>
        Settings
      </Link>
      <Link href="/dashboard/about" onClick={toggleMenu}>
        About Us
      </Link>
    </div>
  );
}