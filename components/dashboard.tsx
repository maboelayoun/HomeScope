"use client";

import { useState } from "react";
import { useExpenseStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Plus, Users, Receipt, PieChart, Settings, LogOut } from "lucide-react";
import { MembersList } from "./members-list";
import { ExpensesList } from "./expenses-list";
import { AddExpenseDialog } from "./add-expense-dialog";
import { AddMemberDialog } from "./add-member-dialog";
import { BalanceOverview } from "./balance-overview";
import { MonthlySummary } from "./monthly-summary";

export function Dashboard() {
  const home = useExpenseStore((state) => state.home);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!home) return null;

  const hasMembers = home.members.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{home.name}</h1>
              <p className="text-xs text-muted-foreground">{home.members.length} members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddMember(true)}>
              <Users className="w-4 h-4 mr-2" />
              Add Member
            </Button>
            <Button size="sm" onClick={() => setShowAddExpense(true)} disabled={!hasMembers}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {!hasMembers ? (
          <Card className="max-w-lg mx-auto mt-12">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Add Your First Roommate</CardTitle>
              <CardDescription>
                Start by adding the people who share expenses in your home.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => setShowAddMember(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="overview" className="gap-2">
                <PieChart className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="gap-2">
                <Receipt className="w-4 h-4" />
                <span className="hidden sm:inline">Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Members</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Summary</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <BalanceOverview />
            </TabsContent>

            <TabsContent value="expenses" className="space-y-6">
              <ExpensesList onAddExpense={() => setShowAddExpense(true)} />
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <MembersList onAddMember={() => setShowAddMember(true)} />
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <MonthlySummary />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Dialogs */}
      <AddExpenseDialog open={showAddExpense} onOpenChange={setShowAddExpense} />
      <AddMemberDialog open={showAddMember} onOpenChange={setShowAddMember} />
    </div>
  );
}
