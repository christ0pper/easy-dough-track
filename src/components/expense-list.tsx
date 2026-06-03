import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ExpenseForm } from "./expense-form";
import { formatCurrency, type Expense } from "@/lib/expenses";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  expenses: Expense[];
  onUpdate: (id: string, data: Omit<Expense, "id" | "createdAt">) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        No expenses match your filters.
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {expenses.map((e) => (
          <li
            key={e.id}
            className="flex flex-col gap-2 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{e.title}</p>
                <Badge variant="secondary">{e.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(e.date).toLocaleDateString()}
                {e.note ? ` · ${e.note}` : ""}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className="font-semibold">{formatCurrency(e.amount)}</span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditing(e)}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeleting(e)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
          </DialogHeader>
          {editing && (
            <ExpenseForm
              initial={editing}
              submitLabel="Update"
              onCancel={() => setEditing(null)}
              onSubmit={(values) => {
                onUpdate(editing.id, values);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.title} — {deleting && formatCurrency(deleting.amount)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) onDelete(deleting.id);
                setDeleting(null);
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
