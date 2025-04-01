"use client";

import { useState, useEffect } from "react";
import BillsSection from "./components/BillsSection";
import ExpensesSection from "./components/ExpensesSection";
import IncomeSection from "./components/IncomeSection";
import { loadData, saveData, initDB } from "./utils/db";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: string;
  date: string;
}

export default function Home() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database and load data on component mount
  useEffect(() => {
    async function initializeAndLoadData() {
      try {
        await initDB();
        const savedData = await loadData();
        if (savedData) {
          setBills(savedData.bills);
          setExpenses(savedData.expenses);
          setIncomes(savedData.incomes);
        }
      } catch (error) {
        console.error("Error initializing or loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initializeAndLoadData();
  }, []);

  // Save data to database whenever it changes
  useEffect(() => {
    async function saveToDatabase() {
      if (!isLoading) {
        try {
          await saveData({
            bills,
            expenses,
            incomes,
          });
        } catch (error) {
          console.error("Error saving data:", error);
        }
      }
    }
    saveToDatabase();
  }, [bills, expenses, incomes, isLoading]);

  // Calculate summary metrics
  const unpaidBills = bills
    .filter((bill) => !bill.isPaid)
    .reduce((sum, bill) => sum + bill.amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const balance = totalIncome - totalExpenses - unpaidBills;

  if (isLoading) {
    return (
      <main className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-900">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Expense Tracker
        </h1>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Income
            </h3>
            <p className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unpaid Bills
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              ${unpaidBills.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Current Balance
            </h3>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <BillsSection bills={bills} setBills={setBills} />
            <ExpensesSection expenses={expenses} setExpenses={setExpenses} />
          </div>
          <div>
            <IncomeSection incomes={incomes} setIncomes={setIncomes} />
          </div>
        </div>
      </div>
    </main>
  );
}
