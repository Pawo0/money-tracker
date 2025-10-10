import {clsx, ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import * as Icons from "lucide-react"
import type {LucideIcon} from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIconByName(name: keyof typeof Icons): LucideIcon {
  const icon = Icons[name];
  return (typeof icon === "object" ? icon : Icons.HelpCircle) as LucideIcon;
}