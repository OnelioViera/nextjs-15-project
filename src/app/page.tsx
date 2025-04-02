"use client";

import { useState, useEffect } from "react";
import { loadData, saveData, initDB, ExpenseData } from "./utils/db";
import BillsSection from "./components/BillsSection";
import ExpensesSection from "./components/ExpensesSection";
import IncomeSection from "./components/IncomeSection";

export default function Home() {
  const [data, setData] = useState<ExpenseData>({
    bills: [],
    expenses: [],
    incomes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("Starting data initialization...");
        await initDB();
        console.log("Database initialized successfully");

        const loadedData = await loadData();
        if (loadedData) {
          setData(loadedData);
          console.log("Data loaded successfully");
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to initialize data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleDataChange = async (newData: ExpenseData) => {
    try {
      await saveData(newData);
      setData(newData);
    } catch (error) {
      console.error("Error saving data:", error);
      setError(error instanceof Error ? error.message : "Failed to save data");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Calculate summary metrics
  const unpaidBills = data.bills
    .filter((bill) => !bill.isPaid)
    .reduce((sum, bill) => sum + bill.amount, 0);
  const totalExpenses = data.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalIncome = data.incomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const balance = totalIncome - totalExpenses - unpaidBills;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Expense Tracker</h1>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Unpaid Bills</h3>
            <p className="text-2xl text-red-600">${unpaidBills.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Expenses</h3>
            <p className="text-2xl text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Income</h3>
            <p className="text-2xl text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Balance</h3>
            <p
              className={`text-2xl ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <BillsSection
              bills={data.bills}
              setBills={(bills) => handleDataChange({ ...data, bills })}
            />
            <ExpensesSection
              expenses={data.expenses}
              setExpenses={(expenses) =>
                handleDataChange({ ...data, expenses })
              }
            />
          </div>
          <div>
            <IncomeSection
              incomes={data.incomes}
              setIncomes={(incomes) => handleDataChange({ ...data, incomes })}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
