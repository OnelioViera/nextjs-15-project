"use client";

import { useState } from "react";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

interface BillsSectionProps {
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

export default function BillsSection({ bills, setBills }: BillsSectionProps) {
  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bill: Bill = {
      id: Date.now().toString(),
      name: newBill.name,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      isPaid: false,
    };
    setBills([...bills, bill]);
    setNewBill({ name: "", amount: "", dueDate: "" });
  };

  const togglePaid = (id: string) => {
    setBills(
      bills.map((bill) =>
        bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
      )
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Bills</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Bill Name"
            value={newBill.name}
            onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
            className="p-2 border rounded text-gray-900"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newBill.amount}
            onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
            className="p-2 border rounded text-gray-900"
            required
          />
          <input
            type="date"
            value={newBill.dueDate}
            onChange={(e) =>
              setNewBill({ ...newBill, dueDate: e.target.value })
            }
            className="p-2 border rounded text-gray-900"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Bill
        </button>
      </form>

      <div className="space-y-2">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div>
              <h3 className="font-semibold text-gray-900">{bill.name}</h3>
              <p className="text-sm text-gray-700">
                ${bill.amount.toFixed(2)} - Due:{" "}
                {new Date(bill.dueDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => togglePaid(bill.id)}
              className={`px-3 py-1 rounded ${
                bill.isPaid
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {bill.isPaid ? "Paid" : "Unpaid"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
