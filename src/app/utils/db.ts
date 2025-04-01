import { sql } from "@vercel/postgres";

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

// Initialize database tables
export async function initDB() {
  try {
    console.log("Initializing database tables...");
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS bills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        due_date DATE NOT NULL,
        is_paid BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category TEXT NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        frequency TEXT NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw new Error("Failed to initialize database tables");
  }
}

export async function saveData(data: ExpenseData) {
  try {
    console.log("Saving data to database:", {
      billsCount: data.bills.length,
      expensesCount: data.expenses.length,
      incomesCount: data.incomes.length,
    });

    // Clear existing data
    await sql`DELETE FROM bills; DELETE FROM expenses; DELETE FROM incomes;`;

    // Insert new data
    for (const bill of data.bills) {
      await sql`
        INSERT INTO bills (id, name, amount, due_date, is_paid)
        VALUES (${bill.id}, ${bill.name}, ${bill.amount}, ${bill.dueDate}, ${bill.isPaid})
      `;
    }

    for (const expense of data.expenses) {
      await sql`
        INSERT INTO expenses (id, description, amount, category, date)
        VALUES (${expense.id}, ${expense.description}, ${expense.amount}, ${expense.category}, ${expense.date})
      `;
    }

    for (const income of data.incomes) {
      await sql`
        INSERT INTO incomes (id, source, amount, frequency, date)
        VALUES (${income.id}, ${income.source}, ${income.amount}, ${income.frequency}, ${income.date})
      `;
    }

    console.log("Data saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    throw new Error("Failed to save data to database");
  }
}

export async function loadData(): Promise<ExpenseData | null> {
  try {
    console.log("Loading data from database...");
    const [billsResult, expensesResult, incomesResult] = await Promise.all([
      sql`SELECT * FROM bills ORDER BY created_at DESC`,
      sql`SELECT * FROM expenses ORDER BY created_at DESC`,
      sql`SELECT * FROM incomes ORDER BY created_at DESC`,
    ]);

    const data = {
      bills: billsResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        amount: parseFloat(row.amount),
        dueDate: row.due_date,
        isPaid: row.is_paid,
      })),
      expenses: expensesResult.rows.map((row) => ({
        id: row.id,
        description: row.description,
        amount: parseFloat(row.amount),
        category: row.category,
        date: row.date,
      })),
      incomes: incomesResult.rows.map((row) => ({
        id: row.id,
        source: row.source,
        amount: parseFloat(row.amount),
        frequency: row.frequency,
        date: row.date,
      })),
    };

    console.log("Data loaded successfully:", {
      billsCount: data.bills.length,
      expensesCount: data.expenses.length,
      incomesCount: data.incomes.length,
    });

    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw new Error("Failed to load data from database");
  }
}

export async function deleteData() {
  try {
    console.log("Deleting all data from database...");
    await sql`DELETE FROM bills; DELETE FROM expenses; DELETE FROM incomes;`;
    console.log("Data deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw new Error("Failed to delete data from database");
  }
}
