"use client";

import { useState } from "react";
import { Income } from "../utils/db";

interface IncomeSectionProps {
  incomes: Income[];
  setIncomes: (incomes: Income[]) => void;
}

export default function IncomeSection({
  incomes,
  setIncomes,
}: IncomeSectionProps) {
  const [newIncome, setNewIncome] = useState<Partial<Income>>({
    source: "",
    amount: 0,
    frequency: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newIncome.source ||
      !newIncome.amount ||
      !newIncome.frequency ||
      !newIncome.date
    )
      return;

    const income: Income = {
      id: crypto.randomUUID(),
      source: newIncome.source,
      amount: Number(newIncome.amount),
      frequency: newIncome.frequency,
      date: newIncome.date,
    };

    setIncomes([...incomes, income]);
    setNewIncome({
      source: "",
      amount: 0,
      frequency: "",
      date: "",
    });
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Income</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Source"
            value={newIncome.source}
            onChange={(e) =>
              setNewIncome({ ...newIncome, source: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newIncome.amount}
            onChange={(e) =>
              setNewIncome({ ...newIncome, amount: Number(e.target.value) })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Frequency"
            value={newIncome.frequency}
            onChange={(e) =>
              setNewIncome({ ...newIncome, frequency: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newIncome.date}
            onChange={(e) =>
              setNewIncome({ ...newIncome, date: e.target.value })
            }
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Income
        </button>
      </form>

      <div className="space-y-4">
        {incomes.map((income) => (
          <div
            key={income.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded"
          >
            <div>
              <h3 className="font-semibold">{income.source}</h3>
              <p className="text-gray-600">
                ${income.amount.toFixed(2)} - {income.frequency} - {income.date}
              </p>
            </div>
            <button
              onClick={() => deleteIncome(income.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
