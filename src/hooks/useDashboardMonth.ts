import {useContext} from "react";
import {DashboardMonthContext} from "@/context/DashboardMonthContext";

export default function useDashboardMonth() {
  const ctx = useContext(DashboardMonthContext);
  if (!ctx) throw new Error("missing provider for DashboardMonthContext");
  return ctx;
}

