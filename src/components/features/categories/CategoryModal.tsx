"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import useCategories from "@/hooks/useCategories";
import { getIconByName } from "@/lib/utils/icons";
import type { Categories } from "@/types/categories";
export default function CategoryModal({
  isOpen,
  onCloseAction,
  onSelectAction,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  onSelectAction: (c: Categories) => void;
}) {
  const { categories, isLoading, error, retry } = useCategories();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseAction();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),a[href]",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [isOpen, onCloseAction]);
  if (!isOpen) return null;
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseAction();
      }}
    >
      <div
        className="category-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-title"
        ref={ref}
      >
        <div className="dialog-heading">
          <h2 id="category-title">Choose a category</h2>
          <button
            className="icon-button"
            aria-label="Close category selector"
            type="button"
            onClick={onCloseAction}
          >
            <X size={19} />
          </button>
        </div>
        {isLoading ? (
          <div className="skeleton h-32" aria-label="Loading categories" />
        ) : error ? (
          <div className="error-banner" role="alert">
            Unable to load categories.
            <button type="button" onClick={() => retry()}>
              Try again
            </button>
          </div>
        ) : !categories.length ? (
          <div className="empty-state">
            <p>No categories available yet.</p>
          </div>
        ) : (
          <div className="category-options">
            {categories.map((c) => {
              const Icon = getIconByName(c.icon);
              return (
                <button
                  type="button"
                  key={c.baseId || c._id || c.name}
                  onClick={() => {
                    onSelectAction(c);
                    onCloseAction();
                  }}
                >
                  <Icon color={c.color} size={23} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
