"use client";

import React from "react";
import { getIconByName } from "@/lib/utils";
import useCategories from "@/hooks/useCategories";
import { motion, AnimatePresence } from "framer-motion";
import {Categories} from "@/types/categories";

interface CategoryModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSelectAction: (category: Categories) => void;
}

export default function CategoryModal({ isOpen, onCloseAction, onSelectAction }: CategoryModalProps) {
  const { categories, isLoading } = useCategories();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCloseAction();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-gray-800 text-white rounded-2xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // zatrzymuje kliknięcia wewnątrz modala
          >
            <h2 className="text-xl font-semibold mb-4 text-center">Select category</h2>

            {isLoading ? (
              <p className="text-center text-gray-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {categories.map((cat: Categories) => {
                  const Icon = getIconByName(cat.icon);
                  return (
                    <button
                      type={"button"}
                      key={cat.baseId || cat._id}
                      className="flex flex-col items-center bg-gray-700 p-3 rounded-xl hover:bg-gray-600 transition cursor-pointer"
                      onClick={() => {
                        onSelectAction(cat);
                        onCloseAction();
                      }}
                    >
                      <Icon className="mb-1" color={cat.color} size={28} />
                      <span className="text-sm text-gray-100 truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type={"button"}
              onClick={onCloseAction}
              className="mt-6 w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-xl cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
