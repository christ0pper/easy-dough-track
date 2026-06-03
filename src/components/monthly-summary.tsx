import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, type Expense } from "@/lib/expenses";

interface Props {
  expenses: Expense[];
}

export function MonthlySummary({ expenses }: Props) {
  const { total, byCategory, monthLabel } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const thisMonth = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === y && d.getMonth() === m;
    });
    const total = thisMonth.reduce((s, e) => s + e.amount, 0);
    const byCategory = thisMonth.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {});
    return {
      total,
      byCategory,
      monthLabel: now.toLocaleString(undefined, { month: "long", year: "numeric" }),
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
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
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
