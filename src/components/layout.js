'use client'; // Add this at the top
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import MenuDropdown from '@/components/MenuDropdown';
import styles from '@/app/styles/Home.module.css';

export default function Layout({ children, title }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.classList.contains(styles.menuBtn)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Head>
        <title>{title} - Rexo Trader</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <button className={styles.menuBtn} onClick={toggleMenu}>
          ☰
        </button>
        <div ref={menuRef}>
          <MenuDropdown isActive={menuOpen} toggleMenu={toggleMenu} />
        </div>
        {children}
      </main>
    </div>
  );
}