import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseFilters, type FilterState } from "@/components/expense-filters";
import { MonthlySummary } from "@/components/monthly-summary";
import { useExpenses } from "@/hooks/use-expenses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Expense Tracker" },
      { name: "description", content: "Track your personal expenses, categorize spending, and see monthly summaries." },
      { property: "og:title", content: "Expense Tracker" },
      { property: "og:description", content: "Track your personal expenses, categorize spending, and see monthly summaries." },
    ],
  }),
  component: Index,
});

function Index() {
  const { expenses, addExpense, updateExpense, deleteExpense, loaded } = useExpenses();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    from: "",
    to: "",
  });

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return expenses
      .filter((e) => {
        if (q && !e.title.toLowerCase().includes(q)) return false;
        if (filters.category !== "all" && e.category !== filters.category) return false;
        if (filters.from && e.date < filters.from) return false;
        if (filters.to && e.date > filters.to) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return b.createdAt - a.createdAt;
      });
  }, [expenses, filters]);

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
                  Expenses {loaded && `(${filtered.length})`}
                </h2>
              </div>
              <ExpenseList
                expenses={filtered}
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
