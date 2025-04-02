import { useState } from "react";
import { db, addDoc, collection } from "@/firebase/config";
import { toast } from "react-toastify";

const WithdrawForm = ({ userId }) => {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleWithdraw = async () => {
    if (!amount || !upiId) {
      toast.error("Enter all details!");
      return;
    }
    await addDoc(collection(db, "withdrawals"), {
      userId,
      amount: parseFloat(amount),
      upiId,
      status: "Pending",
      createdAt: new Date(),
    });
    toast.success("Withdrawal request submitted!");
    setAmount("");
    setUpiId("");
  };

  return (
    <div>
      <h2>Withdraw Funds</h2>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="text" placeholder="UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
      <button onClick={handleWithdraw}>Request Withdrawal</button>
    </div>
  );
};

export default WithdrawForm;
