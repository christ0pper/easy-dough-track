import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  DEFAULT_EXPENSE_FILTERS,
  hasInvalidExpenseFilterRange,
  type ExpenseFilters,
} from "@/lib/expenses";

interface Props {
  value: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
}

export function ExpenseFilters({ value, onChange }: Props) {
  const updateFilters = (patch: Partial<ExpenseFilters>) => onChange({ ...value, ...patch });
  const hasInvalidDateRange = hasInvalidExpenseFilterRange(value);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-1 lg:col-span-2">
        <Label htmlFor="search">Search title</Label>
        <Input
          id="search"
          value={value.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          placeholder="Search..."
        />
      </div>
      <div className="space-y-1">
        <Label>Category</Label>
        <Select
          value={value.category}
          onValueChange={(category) =>
            updateFilters({ category: category as ExpenseFilters["category"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="from">From</Label>
        <Input
          id="from"
          type="date"
          value={value.from}
          onChange={(e) => updateFilters({ from: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          type="date"
          value={value.to}
          onChange={(e) => updateFilters({ to: e.target.value })}
        />
      </div>
      {hasInvalidDateRange && (
        <p className="sm:col-span-2 lg:col-span-5 text-sm text-destructive">
          The start date must be earlier than or equal to the end date.
        </p>
      )}
      <div className="sm:col-span-2 lg:col-span-5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(DEFAULT_EXPENSE_FILTERS)}
        >
          Reset filters
        </Button>
      </div>
    </div>
  );
}
