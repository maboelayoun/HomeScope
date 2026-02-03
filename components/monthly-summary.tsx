"use client";

import { useState } from "react";
import { useExpenseStore } from "@/lib/store";
import { CATEGORY_INFO, type ExpenseCategory } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart, Utensils, Fuel, Zap, Home, Wifi, Package, Tv, MoreHorizontal } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  food: <Utensils className="w-5 h-5" />,
  groceries: <ShoppingCart className="w-5 h-5" />,
  gas: <Fuel className="w-5 h-5" />,
  utilities: <Zap className="w-5 h-5" />,
  rent: <Home className="w-5 h-5" />,
  internet: <Wifi className="w-5 h-5" />,
  household: <Package className="w-5 h-5" />,
  entertainment: <Tv className="w-5 h-5" />,
  other: <MoreHorizontal className="w-5 h-5" />,
};

const categoryColors: Record<ExpenseCategory, string> = {
  food: "#ef4444",
  groceries: "#10b981",
  gas: "#f59e0b",
  utilities: "#3b82f6",
  rent: "#8b5cf6",
  internet: "#06b6d4",
  household: "#ec4899",
  entertainment: "#f97316",
  other: "#6b7280",
};

export function MonthlySummary() {
  const home = useExpenseStore((state) => state.home);
  const getMonthlyExpenses = useExpenseStore((state) => state.getMonthlyExpenses);
  const getTotalByCategory = useExpenseStore((state) => state.getTotalByCategory);
  const getMemberById = useExpenseStore((state) => state.getMemberById);

  const [currentDate, setCurrentDate] = useState(new Date());

  if (!home) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthlyExpenses = getMonthlyExpenses(year, month);
  const categoryTotals = getTotalByCategory(year, month);
  const totalForMonth = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calculate per-member spending for the month
  const memberSpending = home.members.map((member) => {
    const paid = monthlyExpenses
      .filter((e) => e.paidById === member.id)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const owed = monthlyExpenses
      .filter((e) => e.splitBetween.includes(member.id))
      .reduce((sum, e) => sum + e.amount / e.splitBetween.length, 0);

    return {
      member,
      paid,
      owed,
      balance: paid - owed,
    };
  });

  // Sort categories by total
  const sortedCategories = Object.entries(categoryTotals)
    .filter(([, total]) => total > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-foreground">{monthName}</h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Monthly Total */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-primary-foreground/80 text-sm">Total Spent</p>
            <p className="text-4xl font-bold mt-1">${totalForMonth.toFixed(2)}</p>
            <p className="text-primary-foreground/80 text-sm mt-2">
              {monthlyExpenses.length} expense{monthlyExpenses.length !== 1 ? "s" : ""} this month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Where your money went this month</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedCategories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses this month.</p>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map(([category, total]) => {
                const percentage = totalForMonth > 0 ? (total / totalForMonth) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: categoryColors[category as ExpenseCategory] }}
                        >
                          {categoryIcons[category]}
                        </div>
                        <span className="font-medium text-foreground">
                          {CATEGORY_INFO[category as ExpenseCategory].label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${total.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: categoryColors[category as ExpenseCategory],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Summary for Month */}
      <Card>
        <CardHeader>
          <CardTitle>Member Summary</CardTitle>
          <CardDescription>Individual spending for {monthName}</CardDescription>
        </CardHeader>
        <CardContent>
          {memberSpending.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No members yet.</p>
          ) : (
            <div className="space-y-4">
              {memberSpending.map(({ member, paid, owed, balance }) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Paid: ${paid.toFixed(2)} | Share: ${owed.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        balance > 0
                          ? "text-emerald-600"
                          : balance < 0
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {balance > 0 ? "+" : ""}
                      ${balance.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {balance > 0 ? "overpaid" : balance < 0 ? "underpaid" : "even"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
