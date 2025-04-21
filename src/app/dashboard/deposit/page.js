"use client";
import { useState, useEffect } from "react"; // ✅ Import useEffect
import { db, auth } from "@/firebase/config";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth"; // ✅ Hook to get user auth details
import styles from "../../styles/Deposit.module.css"; // Check path
import Image from "next/image";

<Image src="/example.jpg" alt="Example Image" width={500} height={300} />


export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [user, loading] = useAuthState(auth);
  const [userName, setUserName] = useState("");

  // ✅ Fetch user name from Firestore
  useEffect(() => {
    if (user) {
      const fetchUserName = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name); // Assuming "name" is the field storing the username
        }
      };
      fetchUserName();
    }
  }, [user]);

  const handleDepositRequest = async () => {
    if (!amount || !transactionId) {
      alert("Please enter amount and transaction ID.");
      return;
    }

    try {
      await addDoc(collection(db, "pendingTransactions"), {
        userId: user?.uid, // ✅ Automatically fetch user ID
        userName: userName, // ✅ Automatically fetch user name
        type: "Deposit",
        amount: parseFloat(amount),
        transactionId: transactionId,
        status: "Pending",
        timestamp: serverTimestamp(),
      });

      alert("Deposit request submitted. Admin will verify and approve.");
      setAmount("");
      setTransactionId("");
    } catch (error) {
      console.error("Error submitting deposit request:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Deposit Funds</h2>
      <p>Scan the QR Code to make payment</p>
      <Image src="/qrcode.svg" alt="QR Code" width={400} height={200} priority />

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="Enter transaction ID"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        className={styles.inputField}
      />
      <button onClick={handleDepositRequest} className={styles.button}>
        Submit Request
      </button>
    </div>
  );
}
