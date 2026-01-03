import type { MonthKey, DayKey} from "@/lib/utils/date/types";

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function monthKey(date: Date): MonthKey {
  return `${pad2(date.getMonth() + 1)}-${date.getFullYear()}` as MonthKey;
}

export function dayKey(date: Date): DayKey {
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;
}