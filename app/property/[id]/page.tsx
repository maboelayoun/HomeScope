"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Property } from "@/lib/types";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Bed,
  Bath,
  Home,
  Calendar,
  User,
  Loader2,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock property for demo
const mockProperty: Property = {
  id: 1,
  title: "Modern Downtown Apartment",
  description:
    "A beautiful modern apartment in the heart of downtown with stunning city views. This spacious home features floor-to-ceiling windows, hardwood floors throughout, and a gourmet kitchen with stainless steel appliances. The open floor plan creates a seamless flow between the living, dining, and kitchen areas. Both bedrooms are generously sized with ample closet space. Building amenities include a 24-hour doorman, fitness center, rooftop terrace, and on-site parking.",
  location: "Manhattan, New York",
  price: 850000,
  bedrooms: 2,
  bathrooms: 2,
  type: "Apartment",
  createdAt: new Date().toISOString(),
  imageUrls: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
  ],
  ownerName: "John Smith",
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const properties = await api.getProperties();
        const found = properties.find((p) => p.id === parseInt(id));
        setProperty(found || null);
      } catch {
        // Use mock property for demo
        if (parseInt(id) === 1) {
          setProperty(mockProperty);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.removeFromFavorites(parseInt(id));
      } else {
        await api.addToFavorites(parseInt(id));
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setInquiryLoading(true);
    try {
      await api.createInquiry({
        propertyId: parseInt(id),
        message: inquiryMessage,
      });
      setInquirySent(true);
      setInquiryMessage("");
    } catch (error) {
      console.error("Failed to send inquiry:", error);
    } finally {
      setInquiryLoading(false);
    }
  };

  const nextImage = () => {
    if (property?.imageUrls) {
      setCurrentImage((prev) => (prev + 1) % property.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (property?.imageUrls) {
      setCurrentImage((prev) => (prev - 1 + property.imageUrls.length) % property.imageUrls.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Home className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The property you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/">Browse Properties</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = property.imageUrls?.length > 0 ? property.imageUrls : ["/placeholder-property.jpg"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                <Image
                  src={images[currentImage]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImage ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Property Info */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {property.type}
                    </span>
                    <h1 className="font-serif text-3xl font-bold">{property.title}</h1>
                    <div className="flex items-center gap-1 text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className={isFavorite ? "text-red-500" : ""}
                    onClick={handleFavoriteToggle}
                    disabled={favoriteLoading}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-6 py-4 border-y">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <span className="font-medium">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <span className="font-medium">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">Listed {formatDate(property.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-serif text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <p className="text-muted-foreground text-sm">Listed Price</p>
                </CardContent>
              </Card>

              {/* Owner Info */}
              {property.ownerName && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{property.ownerName}</p>
                        <p className="text-sm text-muted-foreground">Property Owner</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Inquiry Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interested in this property?</CardTitle>
                </CardHeader>
                <CardContent>
                  {inquirySent ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <Send className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-medium">Inquiry Sent!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        The owner will get back to you soon.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setInquirySent(false)}
                      >
                        Send Another
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Hi, I'm interested in this property..."
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          rows={4}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={inquiryLoading}>
                        {inquiryLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Inquiry
                          </>
                        )}
                      </Button>
                      {!isAuthenticated && (
                        <p className="text-xs text-muted-foreground text-center">
                          You&apos;ll need to{" "}
                          <Link href="/login" className="text-primary hover:underline">
                            sign in
                          </Link>{" "}
                          to send an inquiry.
                        </p>
                      )}
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
