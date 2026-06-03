export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

export interface ExpenseFilters {
  search: string;
  category: Category | "all";
  from: string;
  to: string;
}

export type ExpenseValidationErrors = Partial<Record<keyof ExpenseInput, string>>;

const STORAGE_KEY = "expenses:v1";

export const DEFAULT_EXPENSE_FILTERS: ExpenseFilters = {
  search: "",
  category: "all",
  from: "",
  to: "",
};

function isExpenseCategory(value: unknown): value is Category {
  return typeof value === "string" && CATEGORIES.includes(value as Category);
}

function isValidDateString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value).getTime())
  );
}

function normalizeExpense(value: unknown): Expense | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<Expense>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.amount !== "number" ||
    !Number.isFinite(candidate.amount) ||
    !isExpenseCategory(candidate.category) ||
    !isValidDateString(candidate.date) ||
    typeof candidate.createdAt !== "number" ||
    !Number.isFinite(candidate.createdAt)
  ) {
    return null;
  }

  return {
    id: candidate.id,
    title: candidate.title,
    amount: candidate.amount,
    category: candidate.category,
    date: candidate.date,
    note: typeof candidate.note === "string" && candidate.note.trim() ? candidate.note : undefined,
    createdAt: candidate.createdAt,
  };
}

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      const expense = normalizeExpense(entry);
      return expense ? [expense] : [];
    });
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function validateExpenseInput(expense: ExpenseInput): ExpenseValidationErrors {
  const errors: ExpenseValidationErrors = {};
  const trimmedTitle = expense.title.trim();
  const trimmedNote = expense.note?.trim() ?? "";
  const today = todayISO();

  if (!trimmedTitle) errors.title = "Title is required";
  else if (trimmedTitle.length > 100) errors.title = "Max 100 chars";

  if (!Number.isFinite(expense.amount)) errors.amount = "Valid amount required";
  else if (expense.amount <= 0) errors.amount = "Must be greater than 0";
  else if (expense.amount > 1_000_000_000) errors.amount = "Too large";

  if (!expense.date) errors.date = "Date required";
  else if (!isValidDateString(expense.date)) errors.date = "Valid date required";
  else if (expense.date > today) errors.date = "Future dates are not allowed";

  if (trimmedNote.length > 500) errors.note = "Max 500 chars";

  return errors;
}

export function normalizeExpenseInput(expense: ExpenseInput): ExpenseInput {
  const trimmedNote = expense.note?.trim();

  return {
    ...expense,
    title: expense.title.trim(),
    note: trimmedNote ? trimmedNote : undefined,
  };
}

export function hasActiveExpenseFilters(filters: ExpenseFilters) {
  return (
    filters.search.trim().length > 0 ||
    filters.category !== "all" ||
    Boolean(filters.from) ||
    Boolean(filters.to)
  );
}

export function hasInvalidExpenseFilterRange(filters: ExpenseFilters) {
  return Boolean(filters.from && filters.to && filters.from > filters.to);
}

export function matchesExpenseFilters(expense: Expense, filters: ExpenseFilters) {
  const searchQuery = filters.search.trim().toLowerCase();

  if (searchQuery && !expense.title.toLowerCase().includes(searchQuery)) return false;
  if (filters.category !== "all" && expense.category !== filters.category) return false;
  if (filters.from && expense.date < filters.from) return false;
  if (filters.to && expense.date > filters.to) return false;

  return true;
}

export function sortExpensesByDate(expenses: Expense[]) {
  return [...expenses].sort((firstExpense, secondExpense) => {
    if (firstExpense.date !== secondExpense.date) {
      return firstExpense.date < secondExpense.date ? 1 : -1;
    }

    return secondExpense.createdAt - firstExpense.createdAt;
  });
}

export function formatExpenseDate(date: string) {
  return new Date(date).toLocaleDateString();
}
