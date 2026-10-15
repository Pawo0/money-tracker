"use client";
import useDashboardMonth from "@/hooks/useDashboardMonth";
import { CalendarDays, ChevronDown } from "lucide-react";
export default function MonthPicker() {
  const { selectedMonth, setSelectedMonth, availableMonths, formatMonthLabel } =
    useDashboardMonth();
  return (
    <div className="period-bar">
      <div>
        <span className="status-dot" />
        Monthly overview
      </div>
      <label className="month-select">
        <CalendarDays size={16} />
        <span className="sr-only">Select month</span>
        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(e.target.value as typeof selectedMonth)
          }
        >
          {[...availableMonths].reverse().map((m) => (
            <option key={m} value={m}>
              {formatMonthLabel(m)}
            </option>
          ))}
        </select>
        <ChevronDown size={14} />
      </label>
    </div>
  );
}
