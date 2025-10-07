"use client";
import {X} from "lucide-react";
import {Categories} from "@/types/categories";

export function CategoryModal(
  {
    categories,
    isOpen,
    onCloseAction,
    onSelectAction,
  }: {
    categories: Categories[];
    isOpen: boolean;
    onCloseAction: () => void;
    onSelectAction: (cat: string) => void;
  }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-80 relative">
        <button
          onClick={onCloseAction}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={24}/>
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">
          Choose a category
        </h2>

        <ul className="grid grid-cols-2 gap-3">
          {categories.map(({name, icon: Icon}) => (
            <li key={name}>
              <button
                onClick={() => onSelectAction(name)}
                className="flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-xl p-3 w-full"
              >
                <Icon className="w-8 h-8 mb-2 text-white"/>
                <span className="text-white text-sm">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
