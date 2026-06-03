import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseFilters } from "@/components/expense-filters";
import { MonthlySummary } from "@/components/monthly-summary";
import { useExpenses } from "@/hooks/use-expenses";
import {
  DEFAULT_EXPENSE_FILTERS,
  hasActiveExpenseFilters,
  hasInvalidExpenseFilterRange,
  matchesExpenseFilters,
  sortExpensesByDate,
} from "@/lib/expenses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Expense Tracker" },
      {
        name: "description",
        content: "Track your personal expenses, categorize spending, and see monthly summaries.",
      },
      { property: "og:title", content: "Expense Tracker" },
      {
        property: "og:description",
        content: "Track your personal expenses, categorize spending, and see monthly summaries.",
      },
    ],
  }),
  component: ExpenseTrackerPage,
});

function ExpenseTrackerPage() {
  const { expenses, addExpense, updateExpense, deleteExpense, loaded } = useExpenses();
  const [filters, setFilters] = useState(DEFAULT_EXPENSE_FILTERS);
  const hasInvalidFilterRange = hasInvalidExpenseFilterRange(filters);
  const hasActiveFilters = hasActiveExpenseFilters(filters);

  const filteredExpenses = useMemo(() => {
    if (hasInvalidFilterRange) return [];

    return sortExpensesByDate(
      expenses.filter((expense) => matchesExpenseFilters(expense, filters)),
    );
  }, [expenses, filters, hasInvalidFilterRange]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
          <p className="text-muted-foreground">Track spending and stay on budget.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add expense</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseForm onSubmit={addExpense} submitLabel="Add" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseFilters value={filters} onChange={setFilters} />
              </CardContent>
            </Card>

            <section>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-xl font-semibold">
                  Expenses {loaded && `(${filteredExpenses.length})`}
                </h2>
              </div>
              <ExpenseList
                expenses={filteredExpenses}
                emptyMessage={
                  hasActiveFilters || hasInvalidFilterRange
                    ? "No expenses match your filters."
                    : "No expenses added yet."
                }
                onUpdate={updateExpense}
                onDelete={deleteExpense}
              />
            </section>
          </div>

          <aside className="space-y-6">
            <MonthlySummary expenses={expenses} />
          </aside>
        </div>
      </div>
    </div>
  );
}
