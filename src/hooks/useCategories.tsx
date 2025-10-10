"use client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useCategories() {
  const {data, isLoading} = useSWR('/api/categories', fetcher);

  return {categories: data, isLoading};
}