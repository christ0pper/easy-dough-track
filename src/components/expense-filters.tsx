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
import { CATEGORIES } from "@/lib/expenses";

export interface FilterState {
  search: string;
  category: string; // "all" or Category
  from: string;
  to: string;
}

interface Props {
  value: FilterState;
  onChange: (v: FilterState) => void;
}

export function ExpenseFilters({ value, onChange }: Props) {
  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });
  const reset = () =>
    onChange({ search: "", category: "all", from: "", to: "" });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-1 lg:col-span-2">
        <Label htmlFor="search">Search title</Label>
        <Input
          id="search"
          value={value.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search..."
        />
      </div>
      <div className="space-y-1">
        <Label>Category</Label>
        <Select
          value={value.category}
          onValueChange={(v) => update({ category: v })}
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
          onChange={(e) => update({ from: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          type="date"
          value={value.to}
          onChange={(e) => update({ to: e.target.value })}
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-5">
        <Button variant="outline" size="sm" onClick={reset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
