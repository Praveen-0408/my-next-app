"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import { db } from "@/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter(); // ✅ Initialize router

  // Fetch only users with role = "user"
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");

        // Corrected Query (Only fetch users where role == "user")
        const usersQuery = query(usersCollection, where("role", "==", "user")); 
        
        const snapshot = await getDocs(usersQuery);

        // Extract user data correctly
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <h2>Users List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>${user.balance || 0}</td>
              <td>
                  {/* ✅ Correct navigation */}
                <button
                onClick={() => router.push(`/adminpanel/users/${user.id}`)}
                >
                  View Transactions
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
