import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, type Expense } from "@/lib/expenses";

interface Props {
  expenses: Expense[];
}

export function MonthlySummary({ expenses }: Props) {
  const { total, byCategory, monthLabel } = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === currentMonth;
    });
    const total = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const byCategory = currentMonthExpenses.reduce<Record<string, number>>((totals, expense) => {
      totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
      return totals;
    }, {});

    return {
      total,
      byCategory,
      monthLabel: currentDate.toLocaleString(undefined, { month: "long", year: "numeric" }),
    };
  }, [expenses]);

  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{monthLabel}</span>
          <span className="text-2xl font-bold">{formatCurrency(total)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses this month.</p>
        ) : (
          <ul className="space-y-2">
            {entries.map(([cat, amt]) => {
              const pct = total > 0 ? (amt / total) * 100 : 0;
              return (
                <li key={cat}>
                  <div className="flex justify-between text-sm">
                    <span>{cat}</span>
                    <span className="font-medium">
                      {formatCurrency(amt)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
