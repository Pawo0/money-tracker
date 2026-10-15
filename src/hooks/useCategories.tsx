"use client";
import useExpenses from "@/hooks/useExpenses";
import { demoCategories } from "@/lib/demo";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import type { Categories } from "@/types/categories";
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Unable to load categories. Please try again.");
  return res.json();
};
export default function useCategories() {
  const { isDemo, ready } = useExpenses();
  const { status } = useSession();
  const { data, isLoading, error, mutate } = useSWR<Categories[]>(
    ready && !isDemo && status === "authenticated" ? "/api/categories" : null,
    fetcher,
  );
  return {
    categories: isDemo ? demoCategories : Array.isArray(data) ? data : [],
    isLoading: !ready || (!isDemo && isLoading),
    error: isDemo ? undefined : error,
    retry: () => mutate(),
  };
}
