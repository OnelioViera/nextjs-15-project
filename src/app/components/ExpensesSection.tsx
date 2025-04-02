"use client";

import { useState } from "react";
import { Expense } from "../utils/db";

interface ExpensesSectionProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

export default function ExpensesSection({
  expenses,
  setExpenses,
}: ExpensesSectionProps) {
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    description: "",
    amount: 0,
    category: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newExpense.description ||
      !newExpense.amount ||
      !newExpense.category ||
      !newExpense.date
    )
      return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      description: newExpense.description,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      description: "",
      amount: 0,
      category: "",
      date: "",
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: Number(e.target.value) })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Expense
        </button>
      </form>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded"
          >
            <div>
              <h3 className="font-semibold">{expense.description}</h3>
              <p className="text-gray-600">
                ${expense.amount.toFixed(2)} - {expense.category} -{" "}
                {expense.date}
              </p>
            </div>
            <button
              onClick={() => deleteExpense(expense.id)}
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
