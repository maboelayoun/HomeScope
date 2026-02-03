"use client";

import { useExpenseStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export function BalanceOverview() {
  const home = useExpenseStore((state) => state.home);
  const getBalances = useExpenseStore((state) => state.getBalances);
  const getSettlements = useExpenseStore((state) => state.getSettlements);
  const getMemberById = useExpenseStore((state) => state.getMemberById);

  if (!home) return null;

  const balances = getBalances();
  const settlements = getSettlements();
  const totalExpenses = home.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-foreground">{home.expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Per Person (avg)</p>
                <p className="text-2xl font-bold text-foreground">
                  ${home.members.length > 0 ? (totalExpenses / home.members.length).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Settlements Needed</p>
                <p className="text-2xl font-bold text-foreground">{settlements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Member Balances</CardTitle>
          <CardDescription>Current balance for each member</CardDescription>
        </CardHeader>
        <CardContent>
          {balances.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {balances.map((balance) => {
                const member = getMemberById(balance.memberId);
                if (!member) return null;
                
                return (
                  <div key={balance.memberId} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Paid: ${balance.totalPaid.toFixed(2)} | Share: ${balance.totalOwed.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          balance.netBalance > 0
                            ? "text-emerald-600"
                            : balance.netBalance < 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {balance.netBalance > 0 ? "+" : ""}
                        ${balance.netBalance.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {balance.netBalance > 0
                          ? "is owed"
                          : balance.netBalance < 0
                          ? "owes"
                          : "settled"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settlements */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Settlements</CardTitle>
          <CardDescription>Simplest way to settle all balances</CardDescription>
        </CardHeader>
        <CardContent>
          {settlements.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="font-medium text-foreground">All settled up!</p>
              <p className="text-sm text-muted-foreground">No payments needed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {settlements.map((settlement, index) => {
                const from = getMemberById(settlement.fromId);
                const to = getMemberById(settlement.toId);
                if (!from || !to) return null;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: from.color }}
                      >
                        {from.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">{from.name}</span>
                    </div>
                    <div className="flex items-center gap-3 px-4">
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      <span className="font-bold text-primary text-lg">
                        ${settlement.amount.toFixed(2)}
                      </span>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">{to.name}</span>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: to.color }}
                      >
                        {to.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
