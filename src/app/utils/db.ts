import { neon, neonConfig } from "@neondatabase/serverless";

// Configure neon for server-side
if (typeof window === "undefined") {
  import("ws").then((ws) => {
    neonConfig.webSocketConstructor = ws.default;
  });
} else {
  neonConfig.webSocketConstructor = WebSocket;
}

neonConfig.useSecureWebSocket = true;
neonConfig.fetchConnectionCache = true;

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Income {
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

interface PostgresError extends Error {
  code?: string;
  hint?: string;
}

// Initialize database connection with connection pooling
const sql = neon(process.env.POSTGRES_URL!);

// Test database connection
async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log(
      "Environment:",
      typeof window === "undefined" ? "server" : "client"
    );
    console.log("Database URL available:", !!process.env.POSTGRES_URL);

    // Test basic query
    const result = await sql`SELECT 1`;
    console.log("Database connection successful", result);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    if (error instanceof Error) {
      const pgError = error as PostgresError;
      console.error("Connection error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: pgError.code,
        hint: pgError.hint,
      });
    }
    return false;
  }
}

// Initialize database tables
export async function initDB() {
  try {
    console.log("Starting database initialization...");
    console.log(
      "Environment:",
      typeof window === "undefined" ? "server" : "client"
    );

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Could not connect to database");
    }

    // Create tables if they don't exist
    console.log("Creating tables...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS bills (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          due_date DATE NOT NULL,
          is_paid BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log("Bills table created/verified");

      await sql`
        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          description TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          category TEXT NOT NULL,
          date DATE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log("Expenses table created/verified");

      await sql`
        CREATE TABLE IF NOT EXISTS incomes (
          id TEXT PRIMARY KEY,
          source TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          frequency TEXT NOT NULL,
          date DATE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log("Incomes table created/verified");
    } catch (tableError) {
      console.error("Error creating tables:", tableError);
      if (tableError instanceof Error) {
        const pgError = tableError as PostgresError;
        console.error("Table creation error details:", {
          message: tableError.message,
          stack: tableError.stack,
          name: tableError.name,
          code: pgError.code,
          hint: pgError.hint,
        });
      }
      throw tableError;
    }

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    if (error instanceof Error) {
      const pgError = error as PostgresError;
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: pgError.code,
        hint: pgError.hint,
      });
    }
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

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Could not connect to database");
    }

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
    if (error instanceof Error) {
      const pgError = error as PostgresError;
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: pgError.code,
        hint: pgError.hint,
      });
    }
    throw new Error("Failed to save data to database");
  }
}

export async function loadData(): Promise<ExpenseData | null> {
  try {
    console.log("Loading data from database...");

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Could not connect to database");
    }

    const [billsResult, expensesResult, incomesResult] = await Promise.all([
      sql`SELECT * FROM bills ORDER BY created_at DESC`,
      sql`SELECT * FROM expenses ORDER BY created_at DESC`,
      sql`SELECT * FROM incomes ORDER BY created_at DESC`,
    ]);

    const data = {
      bills: billsResult.map((row) => ({
        id: row.id,
        name: row.name,
        amount: parseFloat(row.amount),
        dueDate: row.due_date,
        isPaid: row.is_paid,
      })),
      expenses: expensesResult.map((row) => ({
        id: row.id,
        description: row.description,
        amount: parseFloat(row.amount),
        category: row.category,
        date: row.date,
      })),
      incomes: incomesResult.map((row) => ({
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
    if (error instanceof Error) {
      const pgError = error as PostgresError;
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: pgError.code,
        hint: pgError.hint,
      });
    }
    throw new Error("Failed to load data from database");
  }
}

export async function deleteData() {
  try {
    console.log("Deleting all data from database...");

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Could not connect to database");
    }

    await sql`DELETE FROM bills; DELETE FROM expenses; DELETE FROM incomes;`;
    console.log("Data deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting data:", error);
    if (error instanceof Error) {
      const pgError = error as PostgresError;
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: pgError.code,
        hint: pgError.hint,
      });
    }
    throw new Error("Failed to delete data from database");
  }
}
