import { useCallback, useEffect, useState } from "react";
import { loadExpenses, saveExpenses, type Expense, type ExpenseInput } from "@/lib/expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExpenses(loadExpenses());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveExpenses(expenses);
  }, [expenses, loaded]);

  const addExpense = useCallback((data: ExpenseInput) => {
    const newExpense: Expense = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setExpenses((previousExpenses) => [newExpense, ...previousExpenses]);
  }, []);

  const updateExpense = useCallback((id: string, data: ExpenseInput) => {
    setExpenses((previousExpenses) =>
      previousExpenses.map((expense) => (expense.id === id ? { ...expense, ...data } : expense)),
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((previousExpenses) => previousExpenses.filter((expense) => expense.id !== id));
  }, []);

  return { expenses, addExpense, updateExpense, deleteExpense, loaded };
}
