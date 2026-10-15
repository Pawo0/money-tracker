import type { Categories } from "@/types/categories";

export interface ExpensesData {
  _id?: string;
  userId?: string;
  date: string;
  amount: number;
  category: Categories;
  title: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpensesInputData {
  date: string;
  amount: string;
  category: Categories | null;
  title: string;
  description?: string;
}

export interface ExpensesContextInterface {
  isDemo: boolean;
  ready: boolean;
  startDemo: () => boolean;
  exitDemo: () => boolean;
  resetDemo: () => boolean;
  addExpense: (input: Omit<ExpensesData, "_id">) => Promise<void>;
  getExpense: (id: string, signal?: AbortSignal) => Promise<ExpensesData>;
  deleteExpense: (id: string) => Promise<void>;
  expenses: ExpensesData[];
  error: string | null;
  loading: boolean;
  fetchExpenses: () => Promise<void>;
}
