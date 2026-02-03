import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PropertyList } from "@/components/property-list";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <PropertyList />
      </main>
      <Footer />
    </div>
  );
}
