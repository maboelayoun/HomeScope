"use client";

import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/property-card";
import { api } from "@/lib/api";
import type { Property } from "@/lib/types";
import { Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await api.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Saved Properties</h1>
        <p className="text-muted-foreground mt-1">
          Properties you&apos;ve saved to view later
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No saved properties</h3>
          <p className="text-muted-foreground mb-6">
            Start exploring and save properties you like
          </p>
          <Button asChild>
            <Link href="/">Browse Properties</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={true}
              onFavoriteChange={fetchFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}
