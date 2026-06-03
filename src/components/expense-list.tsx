import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseForm } from "./expense-form";
import { formatCurrency, formatExpenseDate, type Expense, type ExpenseInput } from "@/lib/expenses";

interface Props {
  expenses: Expense[];
  emptyMessage?: string;
  onUpdate: (id: string, data: ExpenseInput) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({
  expenses,
  emptyMessage = "No expenses found.",
  onUpdate,
  onDelete,
}: Props) {
  const [expenseBeingEdited, setExpenseBeingEdited] = useState<Expense | null>(null);
  const [expenseBeingDeleted, setExpenseBeingDeleted] = useState<Expense | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex flex-col gap-2 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{expense.title}</p>
                <Badge variant="secondary">{expense.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatExpenseDate(expense.date)}
                {expense.note ? ` - ${expense.note}` : ""}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className="font-semibold">{formatCurrency(expense.amount)}</span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setExpenseBeingEdited(expense)}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setExpenseBeingDeleted(expense)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        open={Boolean(expenseBeingEdited)}
        onOpenChange={(isOpen) => !isOpen && setExpenseBeingEdited(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
          </DialogHeader>
          {expenseBeingEdited && (
            <ExpenseForm
              initial={expenseBeingEdited}
              submitLabel="Update"
              onCancel={() => setExpenseBeingEdited(null)}
              onSubmit={(values) => {
                onUpdate(expenseBeingEdited.id, values);
                setExpenseBeingEdited(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(expenseBeingDeleted)}
        onOpenChange={(isOpen) => !isOpen && setExpenseBeingDeleted(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>
              {expenseBeingDeleted?.title}
              {expenseBeingDeleted ? ` - ${formatCurrency(expenseBeingDeleted.amount)}` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (expenseBeingDeleted) onDelete(expenseBeingDeleted.id);
                setExpenseBeingDeleted(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
