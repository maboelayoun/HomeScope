"use client";

import { useState } from "react";
import { useExpenseStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Receipt, PieChart, ArrowRight, Wallet, Calculator, CheckCircle } from "lucide-react";

export function LandingPage() {
  const [homeName, setHomeName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const createHome = useExpenseStore((state) => state.createHome);

  const handleCreate = () => {
    if (homeName.trim()) {
      createHome(homeName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">SplitWise Home</span>
          </div>
          <Button onClick={() => setShowCreate(true)}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Split expenses without the headache
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Track shared expenses with your roommates effortlessly. See who paid for groceries, gas, utilities, and more. Settle up fairly at the end of each month.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => setShowCreate(true)} className="gap-2">
                  Create Your Home <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>No sign up required</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8">
                <Card className="shadow-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Monthly Summary</CardTitle>
                    <CardDescription>January 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-medium">A</div>
                          <span className="font-medium text-foreground">Ahmed</span>
                        </div>
                        <span className="text-emerald-600 font-semibold">+$245.00</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">S</div>
                          <span className="font-medium text-foreground">Sara</span>
                        </div>
                        <span className="text-red-500 font-semibold">-$120.50</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-medium">M</div>
                          <span className="font-medium text-foreground">Mohammed</span>
                        </div>
                        <span className="text-red-500 font-semibold">-$124.50</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Everything you need to manage shared expenses</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Simple tools to track spending, split costs fairly, and keep everyone on the same page.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Add Roommates</h3>
                <p className="text-sm text-muted-foreground">
                  Add all your housemates and track everyone{"'"}s contributions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Log Expenses</h3>
                <p className="text-sm text-muted-foreground">
                  Record groceries, gas, utilities, and any shared purchase.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Auto Calculate</h3>
                <p className="text-sm text-muted-foreground">
                  See who owes whom with automatic balance calculations.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Settle Up</h3>
                <p className="text-sm text-muted-foreground">
                  Get clear payment suggestions to settle balances fairly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">How it works</h2>
          </div>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Create your home</h3>
                <p className="text-muted-foreground mt-1">Give your shared living space a name and start tracking expenses together.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Add your roommates</h3>
                <p className="text-muted-foreground mt-1">Add everyone who shares expenses. Each person gets their own profile and color.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Log expenses as they happen</h3>
                <p className="text-muted-foreground mt-1">Whenever someone buys groceries, pays a bill, or fills up on gas - log it with a few taps.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">4</div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Settle up at month end</h3>
                <p className="text-muted-foreground mt-1">View the monthly summary to see exactly who owes whom, then settle up with ease.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Create Home Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create Your Home</CardTitle>
              <CardDescription>Give your shared living space a name to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="e.g., Apartment 4B, Beach House..."
                  value={homeName}
                  onChange={(e) => setHomeName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleCreate} disabled={!homeName.trim()}>
                    Create Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>SplitWise Home - Share expenses fairly with your roommates</p>
        </div>
      </footer>
    </div>
  );
}
