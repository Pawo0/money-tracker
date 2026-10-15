"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import useCategories from "@/hooks/useCategories";
import { motion, AnimatePresence } from "framer-motion";
import { Categories } from "@/types/categories";
import { getIconByName } from "@/lib/utils/icons";

interface CategoryModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSelectAction: (category: Categories) => void;
}

export default function CategoryModal({
  isOpen,
  onCloseAction,
  onSelectAction,
}: CategoryModalProps) {
  const { categories, isLoading } = useCategories();
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseAction();
      if (event.key === "Tab") {
        const buttons =
          dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialogRef.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === dialogRef.current)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [isOpen, onCloseAction]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCloseAction();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="category-modal"
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-dialog-title"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // zatrzymuje kliknięcia wewnątrz modala
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">EXPENSE DETAILS</span>
                <h2 id="category-dialog-title">Choose a category</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={onCloseAction}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {isLoading ? (
              <p className="loading-panel" role="status">
                Loading categories…
              </p>
            ) : (
              <div className="category-grid">
                {categories.map((cat: Categories) => {
                  const Icon = getIconByName(cat.icon);
                  return (
                    <button
                      type={"button"}
                      key={cat.baseId || cat._id}
                      className="category-option"
                      onClick={() => {
                        onSelectAction(cat);
                        onCloseAction();
                      }}
                    >
                      <Icon className="mb-1" color={cat.color} size={28} />
                      <span className="category-option-label">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type={"button"}
              onClick={onCloseAction}
              className="button button-secondary modal-close"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
