"use client";

import { useState } from "react";

interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: string;
  date: string;
}

interface IncomeSectionProps {
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
}

export default function IncomeSection({
  incomes,
  setIncomes,
}: IncomeSectionProps) {
  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    frequency: "monthly",
    date: new Date().toISOString().split("T")[0],
  });

  const frequencies = ["weekly", "bi-weekly", "monthly", "yearly", "one-time"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const income: Income = {
      id: Date.now().toString(),
      source: newIncome.source,
      amount: parseFloat(newIncome.amount),
      frequency: newIncome.frequency,
      date: newIncome.date,
    };
    setIncomes([...incomes, income]);
    setNewIncome({
      source: "",
      amount: "",
      frequency: "monthly",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Income</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Income Source"
            value={newIncome.source}
            onChange={(e) =>
              setNewIncome({ ...newIncome, source: e.target.value })
            }
            className="p-2 border rounded text-gray-900"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newIncome.amount}
            onChange={(e) =>
              setNewIncome({ ...newIncome, amount: e.target.value })
            }
            className="p-2 border rounded text-gray-900"
            required
          />
          <select
            value={newIncome.frequency}
            onChange={(e) =>
              setNewIncome({ ...newIncome, frequency: e.target.value })
            }
            className="p-2 border rounded text-gray-900"
            required
          >
            {frequencies.map((freq) => (
              <option key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newIncome.date}
            onChange={(e) =>
              setNewIncome({ ...newIncome, date: e.target.value })
            }
            className="p-2 border rounded text-gray-900"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Income
        </button>
      </form>

      <div className="space-y-2">
        {incomes.map((income) => (
          <div
            key={income.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div>
              <h3 className="font-semibold text-gray-900">{income.source}</h3>
              <p className="text-sm text-gray-700">
                ${income.amount.toFixed(2)} - {income.frequency} -{" "}
                {new Date(income.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
