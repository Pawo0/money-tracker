import {MonthKey} from "@/lib/utils/date/types";

export function sortMonths(months: MonthKey[]): MonthKey[] {
  const sortFn = (a: string, b: string) => {
    const [am, ay] = a.split("-").map(Number);
    const [bm, by] = b.split("-").map(Number);
    if (ay !== by) return ay - by;
    return am - bm;
  }
  return months.sort(sortFn);
}