import type {Categories} from "@/types/categories";

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

export interface ExpensesContextInterface{
  expenses: ExpensesData[];
  loading: boolean;
  fetchExpenses: () => Promise<void>;
}