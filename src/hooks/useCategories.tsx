"use client";
import useSWR from "swr";
import type { Categories } from "@/types/categories";
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Unable to load categories. Please try again.");
  return res.json();
};
export default function useCategories() {
  const { data, isLoading, error, mutate } = useSWR<Categories[]>(
    "/api/categories",
    fetcher,
  );
  return {
    categories: Array.isArray(data) ? data : [],
    isLoading,
    error,
    retry: () => mutate(),
  };
}
