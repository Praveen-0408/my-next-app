// components/Sidebar.js
"use client";
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/Home.module.css';

export default function Sidebar2() {
  const router = useRouter();

  const showSection = (section) => {
    if (section === 'tradenow') {
      router.push('/dashboard/tradenow');
    } else if (section === 'story') {
      router.push('dashboard/story');
    }
  };

  return (
    <div className={styles.sidebar}>
      <button className={styles.sidebarBtn} onClick={() => router.push('/dashboard/tradenow')}>
        <i className="fas fa-handshake"></i>
        <span>Trade Now</span>
      </button>
      <button className={styles.sidebarBtn} onClick={() => router.push('/dashboard/graphs')}>
        <i className="fas fa-chart-line"></i>
        <span>Chart</span>
      </button>
      <button className={styles.sidebarBtn} onClick={() => router.push('/dashboard/story')}>
        <i className="fas fa-book"></i>
        <span>Story</span>
      </button>
    </div>
  );
}