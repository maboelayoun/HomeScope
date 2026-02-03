"use client";

import { useState, useEffect } from "react";
import { PropertyCard } from "./property-card";
import { PropertyFilter } from "./property-filter";
import { api } from "@/lib/api";
import type { Property, PropertyFilter as PropertyFilterType } from "@/lib/types";
import { Loader2, Home } from "lucide-react";

// Mock data for demonstration (used when API is unavailable)
const mockProperties: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    description: "A beautiful modern apartment in the heart of downtown with stunning city views.",
    location: "Manhattan, New York",
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    type: "Apartment",
    createdAt: new Date().toISOString(),
    imageUrls: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"],
    ownerName: "John Smith",
  },
  {
    id: 2,
    title: "Luxury Villa with Pool",
    description: "Stunning luxury villa with private pool, garden, and modern amenities.",
    location: "Beverly Hills, California",
    price: 2500000,
    bedrooms: 5,
    bathrooms: 4,
    type: "Villa",
    createdAt: new Date().toISOString(),
    imageUrls: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"],
    ownerName: "Sarah Johnson",
  },
  {
    id: 3,
    title: "Cozy Studio in Arts District",
    description: "Perfect starter home in the trendy arts district with easy access to cafes and galleries.",
    location: "Brooklyn, New York",
    price: 450000,
    bedrooms: 1,
    bathrooms: 1,
    type: "Studio",
    createdAt: new Date().toISOString(),
    imageUrls: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"],
    ownerName: "Mike Brown",
  },
  {
    id: 4,
    title: "Family Home with Garden",
    description: "Spacious family home with large backyard, perfect for children and pets.",
    location: "Austin, Texas",
    price: 675000,
    bedrooms: 4,
    bathrooms: 3,
    type: "House",
    createdAt: new Date().toISOString(),
    imageUrls: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"],
    ownerName: "Emily Davis",
  },
  {
    id: 5,
    title: "Penthouse with Skyline Views",
    description: "Exclusive penthouse offering panoramic city views and premium finishes.",
    location: "Chicago, Illinois",
    price: 1800000,
    bedrooms: 3,
    bathrooms: 3,
    type: "Penthouse",
    createdAt: new Date().toISOString(),
    imageUrls: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"],
    ownerName: "Robert Wilson",
  },
  {
    id: 6,
    title: "Charming Townhouse",
    description: "Historic townhouse with modern updates in a quiet residential neighborhood.",
    location: "Boston, Massachusetts",
    price: 950000,
    bedrooms: 3,
    bathrooms: 2,
    type: "Townhouse",
    createdAt: new Date().toISOString(),
    imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"],
    ownerName: "Lisa Anderson",
  },
];

export function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async (filters?: PropertyFilterType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProperties(filters);
      setProperties(data);
    } catch {
      // Use mock data when API is unavailable
      let filtered = [...mockProperties];
      if (filters) {
        if (filters.location) {
          filtered = filtered.filter((p) =>
            p.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }
        if (filters.type && filters.type !== "all") {
          filtered = filtered.filter((p) => p.type === filters.type);
        }
        if (filters.priceMin) {
          filtered = filtered.filter((p) => p.price >= filters.priceMin!);
        }
        if (filters.priceMax) {
          filtered = filtered.filter((p) => p.price <= filters.priceMax!);
        }
        if (filters.bedrooms) {
          filtered = filtered.filter((p) => p.bedrooms >= filters.bedrooms!);
        }
      }
      setProperties(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilter = (filters: PropertyFilterType) => {
    fetchProperties(filters);
  };

  const handleReset = () => {
    fetchProperties();
  };

  return (
    <section id="properties" className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold mb-2">Featured Properties</h2>
          <p className="text-muted-foreground">
            Discover our handpicked selection of premium properties
          </p>
        </div>

        <div className="mb-8">
          <PropertyFilter onFilter={handleFilter} onReset={handleReset} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
