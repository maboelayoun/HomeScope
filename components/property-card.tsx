"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Home } from "lucide-react";
import type { Property } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
}

export function PropertyCard({ property, isFavorite = false, onFavoriteChange }: PropertyCardProps) {
  const { isAuthenticated } = useAuth();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFav, setIsFav] = useState(isFavorite);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFav) {
        await api.removeFromFavorites(property.id);
      } else {
        await api.addToFavorites(property.id);
      }
      setIsFav(!isFav);
      onFavoriteChange?.();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = property.imageUrls?.[0] || "/placeholder-property.jpg";

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-white/90 hover:bg-white ${
              isFav ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
          </Button>
          <div className="absolute bottom-3 left-3">
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              {property.type}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{property.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>{property.type}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">{formatPrice(property.price)}</span>
            {property.ownerName && (
              <span className="text-sm text-muted-foreground">by {property.ownerName}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
