import { useCallback, useEffect, useState } from "react";
import {
  loadExpenses,
  saveExpenses,
  type Expense,
} from "@/lib/expenses";

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

  const addExpense = useCallback((data: Omit<Expense, "id" | "createdAt">) => {
    const newExp: Expense = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setExpenses((prev) => [newExp, ...prev]);
  }, []);

  const updateExpense = useCallback(
    (id: string, data: Omit<Expense, "id" | "createdAt">) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...data } : e)),
      );
    },
    [],
  );

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { expenses, addExpense, updateExpense, deleteExpense, loaded };
}
