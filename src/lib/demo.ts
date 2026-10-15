import type { Categories } from "@/types/categories";
import type { ExpensesData } from "@/types/expenses";

export const DEMO_STORAGE_KEY = "money-tracker.demo.v1";
export const demoCategories: Categories[] = [
  {
    _id: "demo-groceries",
    name: "Groceries",
    icon: "ShoppingBasket",
    color: "#a7c9a0",
  },
  {
    _id: "demo-food",
    name: "Food & drinks",
    icon: "Utensils",
    color: "#d7b58b",
  },
  { _id: "demo-home", name: "Home", icon: "House", color: "#c9a39c" },
  {
    _id: "demo-transport",
    name: "Transport",
    icon: "TramFront",
    color: "#8eafcb",
  },
  {
    _id: "demo-subscriptions",
    name: "Subscriptions",
    icon: "Music2",
    color: "#b5a0d8",
  },
  {
    _id: "demo-shopping",
    name: "Shopping",
    icon: "ShoppingBag",
    color: "#d5ca97",
  },
  { _id: "demo-health", name: "Health", icon: "HeartPulse", color: "#c593a3" },
  { _id: "demo-leisure", name: "Leisure", icon: "Tickets", color: "#96bdbb" },
];

/** Relative dates keep the demo useful in any month, including the first day. */
export function createDemoExpenses(now = new Date()): ExpensesData[] {
  const templates: [string, number, number, number, string][] = [
    [
      "Weekly groceries",
      186.42,
      0,
      14,
      "Fresh vegetables, breakfast essentials, and groceries for the week.",
    ],
    ["Spotify Premium", 23.99, 4, 13, "Monthly individual subscription."],
    [
      "Coffee with a friend",
      32,
      1,
      12,
      "Two flat whites at the neighbourhood café.",
    ],
    [
      "Monthly travel pass",
      110,
      3,
      10,
      "City transport pass — all tram and bus lines.",
    ],
    ["Dinner at Nolio", 148, 1, 9, "Friday dinner with friends."],
    [
      "Fresh market",
      128.8,
      0,
      7,
      "Seasonal produce and flowers from the Saturday market.",
    ],
    ["Electricity bill", 189, 2, 5, "Monthly electricity payment."],
    ["Netflix", 49, 4, 4, "Monthly streaming subscription."],
    ["Running shoes", 299.9, 5, 4, "A new pair for morning runs."],
    ["Pharmacy", 47.6, 6, 3, "Vitamins and first-aid essentials."],
    ["Cinema tickets", 64, 7, 2, "Two tickets for the evening screening."],
    ["Lunch break", 46, 1, 2, "Lunch near the office."],
    [
      "Rent",
      2200,
      2,
      1,
      "Monthly rent for the apartment, including building fees.",
    ],
  ];
  return [0, 1, 2].flatMap((offset) =>
    templates.map(([title, amount, category, day, description], i) => {
      const year = now.getFullYear();
      const month = now.getMonth() - offset;
      const lastDay =
        offset === 0 ? now.getDate() : new Date(year, month + 1, 0).getDate();
      const date = new Date(year, month, Math.min(day, lastDay), 12);
      return {
        _id: `demo-${offset}-${i}`,
        title,
        amount: -Number(
          (amount * (offset === 0 ? 1 : offset === 1 ? 0.93 : 1.08)).toFixed(2),
        ),
        category: demoCategories[category],
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
        description,
        created_at: date.toISOString(),
      };
    }),
  );
}

export function isDemoExpenses(value: unknown): value is ExpensesData[] {
  return (
    Array.isArray(value) &&
    value.every(
      (e) =>
        e &&
        typeof e._id === "string" &&
        e._id.startsWith("demo-") &&
        typeof e.title === "string" &&
        typeof e.amount === "number" &&
        Number.isFinite(e.amount) &&
        typeof e.date === "string" &&
        !Number.isNaN(new Date(e.date).getTime()) &&
        e.category &&
        typeof e.category.name === "string" &&
        typeof e.category.icon === "string" &&
        typeof e.category.color === "string" &&
        (e.description === undefined || typeof e.description === "string"),
    )
  );
}
