"use client";

import { useExpenseStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Mail } from "lucide-react";
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

interface MembersListProps {
  onAddMember: () => void;
}

export function MembersList({ onAddMember }: MembersListProps) {
  const home = useExpenseStore((state) => state.home);
  const removeMember = useExpenseStore((state) => state.removeMember);
  const getBalances = useExpenseStore((state) => state.getBalances);

  if (!home) return null;

  const balances = getBalances();

  const getMemberBalance = (memberId: string) => {
    const balance = balances.find((b) => b.memberId === memberId);
    return balance?.netBalance ?? 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Members</h2>
          <p className="text-sm text-muted-foreground">People sharing expenses in your home</p>
        </div>
        <Button onClick={onAddMember}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {home.members.map((member) => {
          const balance = getMemberBalance(member.id);
          return (
            <Card key={member.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {member.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the member and all their associated expenses. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeMember(member.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span
                      className={`font-semibold ${
                        balance > 0
                          ? "text-emerald-600"
                          : balance < 0
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {balance > 0 ? "+" : ""}
                      ${balance.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {balance > 0
                      ? "Is owed money"
                      : balance < 0
                      ? "Owes money"
                      : "All settled up"}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
