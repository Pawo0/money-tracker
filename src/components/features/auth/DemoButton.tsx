"use client";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import useExpenses from "@/hooks/useExpenses";
export default function DemoButton() {
  const { startDemo, ready, error } = useExpenses();
  const router = useRouter();
  return (
    <>
      {" "}
      <button
        className="button button-primary"
        disabled={!ready}
        onClick={() => {
          if (startDemo()) router.push("/dashboard");
        }}
      >
        <Play size={14} /> Try demo account
      </button>
      {error && (
        <span className="feedback error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
