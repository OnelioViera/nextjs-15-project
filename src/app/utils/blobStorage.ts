import { put, list, del } from "@vercel/blob";

const BLOB_STORE_ID = "expense-tracker-data";

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
    const { url } = await put(
      `${BLOB_STORE_ID}/data.json`,
      JSON.stringify(data),
      {
        access: "public",
      }
    );
    return url;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
}

export async function loadData(): Promise<ExpenseData | null> {
  try {
    const { blobs } = await list({ prefix: BLOB_STORE_ID });
    const dataBlob = blobs.find(
      (blob) => blob.pathname === `${BLOB_STORE_ID}/data.json`
    );

    if (!dataBlob) {
      return null;
    }

    const response = await fetch(dataBlob.url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
}

export async function deleteData() {
  try {
    const { blobs } = await list({ prefix: BLOB_STORE_ID });
    for (const blob of blobs) {
      await del(blob.url);
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
}
