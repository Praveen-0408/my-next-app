import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          <li><Link href="/adminpanel/create">Create Account</Link></li>
          <li><Link href="/adminpanel/users">Users</Link></li>
          <li><Link href="/adminpanel/transactions">Transactions</Link></li>
          <li><Link href="/adminpanel/settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
}
