// components/SearchBar.js
import { useEffect } from 'react';
import styles from '@/app/styles/Home.module.css';

export default function SearchBar() {
  useEffect(() => {
    const filterTable = () => {
      let input = document.getElementById('searchInput').value.toUpperCase();
      let table = document.getElementById('symbolTable');
      let tr = table.getElementsByTagName('tr');

      for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[0];
        if (td) {
          let textValue = td.textContent || td.innerText;
          tr[i].style.display = textValue.toUpperCase().indexOf(input) > -1 ? '' : 'none';
        }
      }
    };

    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('keyup', filterTable);
    return () => {
      searchInput?.removeEventListener('keyup', filterTable);
    };
  }, []);

  return (
    <div className={styles.searchContainer}>
      <i className={`fas fa-search ${styles.searchIcon}`}></i>
      <input
        type="text"
        id="searchInput"
        className={styles.searchInput}
        placeholder="Search Symbol..."
      />
    </div>
  );
}