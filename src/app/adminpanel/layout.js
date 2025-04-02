"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import "./auth.css";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminLayout({ children }) {
  const router = useRouter();

  // Check if the logged-in user is the admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // Redirect to login if no user is logged in
      } else if (user.email !== ADMIN_EMAIL) {
        // If the user is not the admin, redirect to customer dashboard
        router.push("/adminpanel");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link href="/adminpanel/create">Create Account</Link>
          <Link href="/adminpanel/users">Users</Link>
          <Link href="/adminpanel/transactions">Transactions</Link>
          <Link href="/adminpanel/settings">Settings</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="content">{children}</div>
    </div>
  );
}