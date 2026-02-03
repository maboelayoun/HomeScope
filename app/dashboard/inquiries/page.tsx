"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Inquiry } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, User, Calendar, Building } from "lucide-react";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await api.getReceivedInquiries();
        setInquiries(data);
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
        setInquiries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground mt-1">
          Messages from potential buyers about your properties
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No inquiries yet</h3>
          <p className="text-muted-foreground mb-6">
            When buyers contact you about your properties, their messages will appear here
          </p>
          <Button asChild>
            <Link href="/dashboard/my-properties">View My Properties</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{inquiry.userName}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                          <Building className="h-3 w-3" />
                          <Link
                            href={`/property/${inquiry.propertyId}`}
                            className="hover:text-primary transition-colors"
                          >
                            {inquiry.propertyTitle}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Calendar className="h-3 w-3" />
                        {formatDate(inquiry.createdAt)}
                      </div>
                    </div>
                    <p className="mt-3 text-muted-foreground">{inquiry.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
