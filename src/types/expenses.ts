export interface ExpensesData {
  _id?: string;
  userId?: string;
  date: string;
  amount: number;
  category: string;
  title: string;
  description?: string;
}

export interface ExpensesInputData {
  date: string;
  amount: string;
  category: string;
  title: string;
  description?: string;
}

export interface ExpensesContextInterface{
  expenses: ExpensesData[];
  loading: boolean;
  fetchExpenses: () => Promise<void>;
}