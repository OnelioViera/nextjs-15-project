import { put, list, del } from "@vercel/blob";

const BLOB_STORE_ID = "expense-tracker-data";

export interface ExpenseData {
  bills: any[];
  expenses: any[];
  incomes: any[];
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
