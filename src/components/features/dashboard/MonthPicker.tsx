"use client";

import useDashboardMonth from "@/hooks/useDashboardMonth";

export default function MonthPicker() {
  const {selectedMonth, setSelectedMonth, availableMonths, formatMonthLabel} = useDashboardMonth();

  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-gray-400">Expenses for the month</p>
        <p className="truncate text-base font-semibold text-gray-100">{formatMonthLabel(selectedMonth)}</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-300">
        <span className="sr-only">Select month</span>
        <select
          className="rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-100 ring-1 ring-white/10"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value as typeof selectedMonth)}
        >
          {[...availableMonths].reverse().map((m) => (
            <option key={m} value={m}>
              {formatMonthLabel(m)}
            </option>
          ))}
        </select>
      </label>
    </div>

  )
}