"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, Check, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });

      if (res.ok) {
        toast.success(isApproved ? "Review approved" : "Review rejected");
        fetchReviews();
      } else {
        toast.error("Failed to update review");
      }
    } catch (error) {
      console.error("Failed to update review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Reviews</h1>
        <Badge>{reviews.length} Total</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No reviews yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <Link
                        href={`/admin/products/${review.product.id}`}
                        className="hover:underline font-medium"
                      >
                        {review.product.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{review.user.name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">{review.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{review.comment}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={review.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {!review.isApproved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(review.id, true)}
                            title="Approve"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                        {review.isApproved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(review.id, false)}
                            title="Reject"
                          >
                            <X className="w-4 h-4 text-orange-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
