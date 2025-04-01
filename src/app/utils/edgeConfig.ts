import { get, set } from "@vercel/edge-config";

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

export interface ExpenseData {
  bills: Bill[];
  expenses: Expense[];
  incomes: Income[];
}

export async function saveData(data: ExpenseData) {
  try {
    await set("expenseData", data);
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
}

export async function loadData(): Promise<ExpenseData | null> {
  try {
    const data = await get<ExpenseData>("expenseData");
    return data || null;
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
}

export async function deleteData() {
  try {
    await set("expenseData", null);
    return true;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
}
