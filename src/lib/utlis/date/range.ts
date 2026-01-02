import type {MonthKey} from "./types";
import {monthKey} from "./keys";

export function startOfMonth(month: MonthKey): Date {
  const [m, y] = month.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, 1, 0, 0, 0, 0);
}

export function endOfMonth(month: MonthKey): Date {
  const [m, y] = month.split("-").map(Number);
  return new Date(y, (m ?? 1), 0, 23, 59, 59, 999);
}

export function sameMonth(date: Date, month: MonthKey): boolean {
  return monthKey(date) === month;
}
