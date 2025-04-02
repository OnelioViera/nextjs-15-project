"use client";

import { useState } from "react";
import { Bill } from "../utils/db";

interface BillsSectionProps {
  bills: Bill[];
  setBills: (bills: Bill[]) => void;
}

export default function BillsSection({ bills, setBills }: BillsSectionProps) {
  const [newBill, setNewBill] = useState<Partial<Bill>>({
    name: "",
    amount: 0,
    dueDate: "",
    isPaid: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.name || !newBill.amount || !newBill.dueDate) return;

    const bill: Bill = {
      id: crypto.randomUUID(),
      name: newBill.name,
      amount: Number(newBill.amount),
      dueDate: newBill.dueDate,
      isPaid: false,
    };

    setBills([...bills, bill]);
    setNewBill({
      name: "",
      amount: 0,
      dueDate: "",
      isPaid: false,
    });
  };

  const togglePaid = (id: string) => {
    setBills(
      bills.map((bill) =>
        bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
      )
    );
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Bills</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Bill Name"
            value={newBill.name}
            onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newBill.amount}
            onChange={(e) =>
              setNewBill({ ...newBill, amount: Number(e.target.value) })
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newBill.dueDate}
            onChange={(e) =>
              setNewBill({ ...newBill, dueDate: e.target.value })
            }
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Bill
        </button>
      </form>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded"
          >
            <div>
              <h3 className="font-semibold">{bill.name}</h3>
              <p className="text-gray-600">
                ${bill.amount.toFixed(2)} - Due: {bill.dueDate}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => togglePaid(bill.id)}
                className={`px-3 py-1 rounded ${
                  bill.isPaid
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {bill.isPaid ? "Paid" : "Unpaid"}
              </button>
              <button
                onClick={() => deleteBill(bill.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
