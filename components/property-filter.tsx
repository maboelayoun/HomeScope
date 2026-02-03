"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { PropertyFilter as PropertyFilterType } from "@/lib/types";

interface PropertyFilterProps {
  onFilter: (filters: PropertyFilterType) => void;
  onReset: () => void;
}

const propertyTypes = ["Apartment", "Villa", "House", "Studio", "Penthouse", "Townhouse"];

export function PropertyFilter({ onFilter, onReset }: PropertyFilterProps) {
  const [location, setLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      location: location || undefined,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      type: type || undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
    });
  };

  const handleReset = () => {
    setLocation("");
    setPriceMin("");
    setPriceMax("");
    setType("");
    setBedrooms("");
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City or area"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any type</SelectItem>
              {propertyTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceMin">Min Price</Label>
          <Input
            id="priceMin"
            type="number"
            placeholder="$0"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceMax">Max Price</Label>
          <Input
            id="priceMax"
            type="number"
            placeholder="No limit"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}+ beds
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Button type="submit" className="flex-1 md:flex-none">
          <Search className="h-4 w-4 mr-2" />
          Search Properties
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </form>
  );
}
