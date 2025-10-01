export interface ExpensesData {
  _id: string;
  userId: string;
  date: string;
  amount: number;
  category: string;
  title: string
}

export interface ExpensesContextInterface{
  expenses: ExpensesData[];
  loading: boolean
}