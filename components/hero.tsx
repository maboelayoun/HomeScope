import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-primary py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary-foreground mb-6 text-balance">
            Find Your Perfect Home with HomeScope
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Discover exceptional properties that match your lifestyle. From modern apartments to 
            luxurious villas, find your dream home with our curated collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#properties">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/register">List Your Property</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
