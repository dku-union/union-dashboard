"use client";

import { useState, useEffect } from "react";
import { ReviewRecord } from "@/types/review";
import { mockReviews } from "@/data/reviews";

export function useReviews() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReviews(mockReviews);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const resubmit = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, status: "in_review" as const, submittedAt: new Date().toISOString().split("T")[0] } : r
      )
    );
  };

  return { reviews, isLoading, resubmit };
}
