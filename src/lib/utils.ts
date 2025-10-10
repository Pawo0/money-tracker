import {clsx, ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import * as Icons from "lucide-react"
import type {LucideIcon} from "lucide-react"
import type {IconNames} from "@/types/categories";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIconByName(name: string): LucideIcon {
  const icon = Icons[name as IconNames];
  return (typeof icon === "object" ? icon : Icons.HelpCircle) as LucideIcon;
}