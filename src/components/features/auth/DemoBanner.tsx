"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, RotateCcw, LogOut } from "lucide-react";
import useExpenses from "@/hooks/useExpenses";
export default function DemoBanner() {
  const { isDemo, resetDemo, exitDemo, error } = useExpenses();
  const [notice, setNotice] = useState("");
  const router = useRouter();
  if (!isDemo) return null;
  return (
    <div className="demo-notice">
      <div className="demo-banner">
        <span>
          <FlaskConical size={17} />
          <span>
            <strong>Demo account</strong>
            <span className="muted">
              {" "}
              · Sample data saved in this browser. Try adding or deleting an
              expense.
            </span>
          </span>
        </span>
        <div className="demo-actions">
          <button
            className="button button-secondary"
            onClick={() => {
              if (resetDemo()) {
                setNotice("Demo data restored.");
                router.push("/dashboard");
              }
            }}
          >
            <RotateCcw size={13} /> Reset demo
          </button>
          <button
            className="button button-secondary"
            onClick={() => {
              if (exitDemo()) router.push("/");
            }}
          >
            <LogOut size={13} /> Exit demo
          </button>
        </div>
      </div>
      {notice && (
        <p className="demo-feedback" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="feedback error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
