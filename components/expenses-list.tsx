"use client";

import { useExpenseStore } from "@/lib/store";
import { CATEGORY_INFO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ShoppingCart, Utensils, Fuel, Zap, Home, Wifi, Package, Tv, MoreHorizontal, Receipt } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExpensesListProps {
  onAddExpense: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  food: <Utensils className="w-4 h-4" />,
  groceries: <ShoppingCart className="w-4 h-4" />,
  gas: <Fuel className="w-4 h-4" />,
  utilities: <Zap className="w-4 h-4" />,
  rent: <Home className="w-4 h-4" />,
  internet: <Wifi className="w-4 h-4" />,
  household: <Package className="w-4 h-4" />,
  entertainment: <Tv className="w-4 h-4" />,
  other: <MoreHorizontal className="w-4 h-4" />,
};

export function ExpensesList({ onAddExpense }: ExpensesListProps) {
  const home = useExpenseStore((state) => state.home);
  const removeExpense = useExpenseStore((state) => state.removeExpense);
  const getMemberById = useExpenseStore((state) => state.getMemberById);

  if (!home) return null;

  const sortedExpenses = [...home.expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Expenses</h2>
          <p className="text-sm text-muted-foreground">All shared expenses</p>
        </div>
        <Button onClick={onAddExpense}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {sortedExpenses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No expenses yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first shared expense to start tracking.
            </p>
            <Button onClick={onAddExpense}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedExpenses.map((expense) => {
            const paidBy = getMemberById(expense.paidById);
            const splitMembers = expense.splitBetween
              .map((id) => getMemberById(id)?.name)
              .filter(Boolean);

            return (
              <Card key={expense.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        {categoryIcons[expense.category]}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{expense.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{CATEGORY_INFO[expense.category].label}</span>
                          <span>{"•"}</span>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Paid by{" "}
                          <span
                            className="font-medium"
                            style={{ color: paidBy?.color }}
                          >
                            {paidBy?.name}
                          </span>
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this expense. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeExpense(expense.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {expense.notes && (
                    <p className="mt-2 text-sm text-muted-foreground pl-14">{expense.notes}</p>
                  )}
                  <div className="mt-2 pl-14">
                    <p className="text-xs text-muted-foreground">
                      Split between: {splitMembers.join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
