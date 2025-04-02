import { useState, useEffect } from "react";
import { db, getDoc, updateDoc, doc, collection, getDocs } from "@/firebase/config";

const AdminPanel = () => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const depositSnapshot = await getDocs(collection(db, "deposits"));
      const withdrawalSnapshot = await getDocs(collection(db, "withdrawals"));

      setDeposits(depositSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setWithdrawals(withdrawalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchTransactions();
  }, []);

  const approveTransaction = async (type, id, userId, amount) => {
    const ref = doc(db, type, id);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentBalance = userSnap.exists() ? userSnap.data().balance || 0 : 0;

    await updateDoc(ref, { status: "Approved" });
    if (type === "deposits") await updateDoc(userRef, { balance: currentBalance + amount });
    if (type === "withdrawals") await updateDoc(userRef, { balance: currentBalance - amount });

    alert("Transaction approved!");
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Pending Deposits</h2>
      {deposits.map(d => (
        <div key={d.id}>
          <p>{d.userId} - ₹{d.amount}</p>
          <button onClick={() => approveTransaction("deposits", d.id, d.userId, d.amount)}>Approve</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
