import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  MIN_EXPENSE_DATE,
  normalizeExpenseInput,
  todayISO,
  validateExpenseInput,
  type Category,
  type Expense,
  type ExpenseInput,
  type ExpenseValidationErrors,
} from "@/lib/expenses";

interface Props {
  initial?: Expense;
  onSubmit: (values: ExpenseInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({ initial, onSubmit, onCancel, submitLabel = "Save" }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<ExpenseValidationErrors>({});

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setAmount(String(initial.amount));
      setCategory(initial.category);
      setDate(initial.date);
      setNote(initial.note ?? "");
    }
    setErrors({});
  }, [initial]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const normalizedExpense = normalizeExpenseInput({
      title,
      amount: Number(amount),
      category,
      date,
      note,
    });
    const newErrors = validateExpenseInput(normalizedExpense);

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit(normalizedExpense);

    if (!initial) {
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate(todayISO());
      setNote("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lunch"
            maxLength={100}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="text"
            value={date}
            inputMode="numeric"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            maxLength={10}
            aria-describedby="date-help"
            onChange={(e) => setDate(e.target.value)}
          />
          <p id="date-help" className="text-xs text-muted-foreground">
            {`Use YYYY-MM-DD. Allowed range: ${MIN_EXPENSE_DATE} to ${todayISO()}.`}
          </p>
          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional"
          maxLength={500}
          rows={2}
        />
        {errors.note && <p className="text-sm text-destructive">{errors.note}</p>}
      </div>
      <div className="flex gap-2">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
