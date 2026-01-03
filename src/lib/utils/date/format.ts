import type {MonthKey} from "./types";

export function formatMonthLabel(
  month: MonthKey,
  locale: string = "en-EN"
): string {
  const [m, y] = month.split("-").map(Number);
  const d = new Date(y, (m ?? 1) - 1, 1);
  return d.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}
