"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Member, Expense, Balance, Settlement, ExpenseCategory, Home } from "./types";
import { MEMBER_COLORS } from "./types";

interface ExpenseStore {
  home: Home | null;
  
  // Home actions
  createHome: (name: string) => void;
  
  // Member actions
  addMember: (name: string, email: string) => void;
  removeMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  
  // Expense actions
  addExpense: (expense: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  
  // Calculations
  getBalances: () => Balance[];
  getSettlements: () => Settlement[];
  getMonthlyExpenses: (year: number, month: number) => Expense[];
  getTotalByCategory: (year: number, month: number) => Record<ExpenseCategory, number>;
  getMemberById: (id: string) => Member | undefined;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      home: null,

      createHome: (name: string) => {
        set({
          home: {
            id: generateId(),
            name,
            members: [],
            expenses: [],
            createdAt: new Date().toISOString(),
          },
        });
      },

      addMember: (name: string, email: string) => {
        const { home } = get();
        if (!home) return;

        const colorIndex = home.members.length % MEMBER_COLORS.length;
        const newMember: Member = {
          id: generateId(),
          name,
          email,
          color: MEMBER_COLORS[colorIndex],
        };

        set({
          home: {
            ...home,
            members: [...home.members, newMember],
          },
        });
      },

      removeMember: (id: string) => {
        const { home } = get();
        if (!home) return;

        set({
          home: {
            ...home,
            members: home.members.filter((m) => m.id !== id),
            expenses: home.expenses.filter(
              (e) => e.paidById !== id && !e.splitBetween.includes(id)
            ),
          },
        });
      },

      updateMember: (id: string, updates: Partial<Member>) => {
        const { home } = get();
        if (!home) return;

        set({
          home: {
            ...home,
            members: home.members.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          },
        });
      },

      addExpense: (expense: Omit<Expense, "id">) => {
        const { home } = get();
        if (!home) return;

        const newExpense: Expense = {
          ...expense,
          id: generateId(),
        };

        set({
          home: {
            ...home,
            expenses: [...home.expenses, newExpense],
          },
        });
      },

      removeExpense: (id: string) => {
        const { home } = get();
        if (!home) return;

        set({
          home: {
            ...home,
            expenses: home.expenses.filter((e) => e.id !== id),
          },
        });
      },

      updateExpense: (id: string, updates: Partial<Expense>) => {
        const { home } = get();
        if (!home) return;

        set({
          home: {
            ...home,
            expenses: home.expenses.map((e) =>
              e.id === id ? { ...e, ...updates } : e
            ),
          },
        });
      },

      getMemberById: (id: string) => {
        const { home } = get();
        return home?.members.find((m) => m.id === id);
      },

      getBalances: () => {
        const { home } = get();
        if (!home || home.members.length === 0) return [];

        const balances: Record<string, Balance> = {};

        // Initialize balances for all members
        home.members.forEach((member) => {
          balances[member.id] = {
            memberId: member.id,
            totalPaid: 0,
            totalOwed: 0,
            netBalance: 0,
          };
        });

        // Calculate based on expenses
        home.expenses.forEach((expense) => {
          const splitAmount = expense.amount / expense.splitBetween.length;

          // Add to payer's total paid
          if (balances[expense.paidById]) {
            balances[expense.paidById].totalPaid += expense.amount;
          }

          // Add owed amount for each person in the split
          expense.splitBetween.forEach((memberId) => {
            if (balances[memberId]) {
              balances[memberId].totalOwed += splitAmount;
            }
          });
        });

        // Calculate net balance (positive = should receive, negative = should pay)
        Object.values(balances).forEach((balance) => {
          balance.netBalance = balance.totalPaid - balance.totalOwed;
        });

        return Object.values(balances);
      },

      getSettlements: () => {
        const balances = get().getBalances();
        const settlements: Settlement[] = [];

        // Separate into creditors (owed money) and debtors (owe money)
        const creditors = balances
          .filter((b) => b.netBalance > 0.01)
          .map((b) => ({ id: b.memberId, amount: b.netBalance }))
          .sort((a, b) => b.amount - a.amount);

        const debtors = balances
          .filter((b) => b.netBalance < -0.01)
          .map((b) => ({ id: b.memberId, amount: Math.abs(b.netBalance) }))
          .sort((a, b) => b.amount - a.amount);

        // Match debtors with creditors
        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {
          const debtor = debtors[i];
          const creditor = creditors[j];
          const amount = Math.min(debtor.amount, creditor.amount);

          if (amount > 0.01) {
            settlements.push({
              fromId: debtor.id,
              toId: creditor.id,
              amount: Math.round(amount * 100) / 100,
            });
          }

          debtor.amount -= amount;
          creditor.amount -= amount;

          if (debtor.amount < 0.01) i++;
          if (creditor.amount < 0.01) j++;
        }

        return settlements;
      },

      getMonthlyExpenses: (year: number, month: number) => {
        const { home } = get();
        if (!home) return [];

        return home.expenses.filter((expense) => {
          const date = new Date(expense.date);
          return date.getFullYear() === year && date.getMonth() === month;
        });
      },

      getTotalByCategory: (year: number, month: number) => {
        const expenses = get().getMonthlyExpenses(year, month);
        const totals: Record<ExpenseCategory, number> = {
          food: 0,
          groceries: 0,
          gas: 0,
          utilities: 0,
          rent: 0,
          internet: 0,
          household: 0,
          entertainment: 0,
          other: 0,
        };

        expenses.forEach((expense) => {
          totals[expense.category] += expense.amount;
        });

        return totals;
      },
    }),
    {
      name: "home-share-expense-storage",
    }
  )
);
