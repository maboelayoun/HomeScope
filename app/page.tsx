"use client";

import { useExpenseStore } from "@/lib/store";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  const home = useExpenseStore((state) => state.home);

  if (!home) {
    return <LandingPage />;
  }

  return <Dashboard />;
}
