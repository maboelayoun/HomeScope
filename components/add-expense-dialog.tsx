"use client";

import { useState } from "react";
import { useExpenseStore } from "@/lib/store";
import { CATEGORY_INFO, type ExpenseCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
  const home = useExpenseStore((state) => state.home);
  const addExpense = useExpenseStore((state) => state.addExpense);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("groceries");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidById("");
    setCategory("groceries");
    setDate(new Date().toISOString().split("T")[0]);
    setSplitBetween([]);
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !paidById || splitBetween.length === 0) {
      return;
    }

    addExpense({
      description,
      amount: parseFloat(amount),
      paidById,
      category,
      date,
      splitBetween,
      notes: notes || undefined,
    });

    resetForm();
    onOpenChange(false);
  };

  const handleSplitToggle = (memberId: string) => {
    setSplitBetween((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllMembers = () => {
    if (home) {
      setSplitBetween(home.members.map((m) => m.id));
    }
  };

  if (!home) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Record a new shared expense.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Weekly groceries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidById} onValueChange={setPaidById}>
              <SelectTrigger>
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {home.members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: member.color }}
                      />
                      {member.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Split Between</Label>
              <Button type="button" variant="link" size="sm" onClick={selectAllMembers} className="h-auto p-0">
                Select All
              </Button>
            </div>
            <div className="border border-border rounded-lg p-3 space-y-2">
              {home.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`split-${member.id}`}
                    checked={splitBetween.includes(member.id)}
                    onCheckedChange={() => handleSplitToggle(member.id)}
                  />
                  <label
                    htmlFor={`split-${member.id}`}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
            {splitBetween.length > 0 && amount && (
              <p className="text-xs text-muted-foreground">
                Each person pays: ${(parseFloat(amount) / splitBetween.length).toFixed(2)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!description || !amount || !paidById || splitBetween.length === 0}>
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
