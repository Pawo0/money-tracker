"use client";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import type { ExpensesData, ExpensesContextInterface } from "@/types/expenses";
import {
  createDemoExpenses,
  DEMO_STORAGE_KEY,
  isDemoExpenses,
} from "@/lib/demo";
export const ExpensesContext = createContext<ExpensesContextInterface | null>(
  null,
);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const requestVersion = useRef(0);
  const [expenses, setExpenses] = useState<ExpensesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        const data: unknown = JSON.parse(saved);
        if (isDemoExpenses(data)) {
          setExpenses(data);
          setIsDemo(true);
          setLoading(false);
        } else localStorage.removeItem(DEMO_STORAGE_KEY);
      }
    } catch {
      setError(
        "Your saved demo could not be restored. You can start a fresh demo.",
      );
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== DEMO_STORAGE_KEY) return;
      try {
        const data: unknown =
          event.newValue === null ? null : JSON.parse(event.newValue);
        if (data !== null && !isDemoExpenses(data)) return;
        requestVersion.current++;
        setExpenses(data ?? []);
        setIsDemo(data !== null);
        setLoading(data === null && status === "authenticated");
        setError(null);
      } catch {
        setError(
          "Demo changes in another tab could not be loaded. Reset demo to start fresh.",
        );
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [status]);

  const saveDemo = useCallback((items: ExpensesData[]) => {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(items));
    } catch {
      throw new Error(
        "Demo changes could not be saved. Please allow browser storage and try again.",
      );
    }
    setExpenses(items);
  }, []);

  const startDemo = useCallback(() => {
    try {
      saveDemo(createDemoExpenses());
      requestVersion.current++;
      setIsDemo(true);
      setLoading(false);
      setError(null);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }, [saveDemo]);
  const resetDemo = useCallback(() => {
    try {
      saveDemo(createDemoExpenses());
      setError(null);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }, [saveDemo]);
  const exitDemo = useCallback(() => {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      requestVersion.current++;
      setIsDemo(false);
      setExpenses([]);
      setLoading(status === "authenticated");
      setError(null);
      return true;
    } catch {
      setError(
        "Unable to leave the demo. Please allow browser storage and try again.",
      );
      return false;
    }
  }, [status]);

  const fetchExpenses = useCallback(async () => {
    if (isDemo || !ready || status !== "authenticated") return;
    const version = ++requestVersion.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok)
        throw new Error("Unable to load transactions. Please try again.");
      const data = await res.json();
      if (!Array.isArray(data))
        throw new Error("Unable to load transactions. Please try again.");
      if (version === requestVersion.current) setExpenses(data);
    } catch (e) {
      if (version === requestVersion.current)
        setError(
          e instanceof Error ? e.message : "Unable to load transactions.",
        );
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [isDemo, ready, status]);
  useEffect(() => {
    if (!ready || isDemo) return;
    if (status === "authenticated") void fetchExpenses();
    else if (status === "unauthenticated") {
      requestVersion.current++;
      setExpenses([]);
      setLoading(false);
    }
  }, [status, isDemo, ready, fetchExpenses]);

  const addExpense = async (input: Omit<ExpensesData, "_id">) => {
    if (isDemo) {
      saveDemo([
        {
          ...input,
          _id: `demo-${crypto.randomUUID()}`,
          created_at: new Date().toISOString(),
        },
        ...expenses,
      ]);
      return;
    }
    if (status !== "authenticated")
      throw new Error("Please sign in to save an expense.");
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok)
      throw new Error("Your expense could not be saved. Please try again.");
    await fetchExpenses();
  };
  const getExpense = useCallback(
    async (id: string, signal?: AbortSignal) => {
      if (isDemo) {
        const item = expenses.find((e) => e._id === id);
        if (!item) throw new Error("This transaction could not be found.");
        return item;
      }
      if (status !== "authenticated")
        throw new Error("Please sign in to view this transaction.");
      const res = await fetch(`/api/expenses/${encodeURIComponent(id)}`, {
        signal,
      });
      if (!res.ok)
        throw new Error(
          res.status === 404
            ? "This transaction could not be found."
            : "Unable to load this transaction.",
        );
      return (await res.json()) as ExpensesData;
    },
    [isDemo, expenses, status],
  );
  const deleteExpense = async (id: string) => {
    if (isDemo) {
      saveDemo(expenses.filter((e) => e._id !== id));
      return;
    }
    if (status !== "authenticated")
      throw new Error("Please sign in to delete a transaction.");
    const res = await fetch(`/api/expenses/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error("Unable to delete the transaction. Please try again.");
    await fetchExpenses();
  };
  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        loading: loading || !ready,
        error,
        fetchExpenses,
        isDemo,
        ready,
        startDemo,
        exitDemo,
        resetDemo,
        addExpense,
        getExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
